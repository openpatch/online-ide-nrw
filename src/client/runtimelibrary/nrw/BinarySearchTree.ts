import { Module } from "../../compiler/parser/Module";
import { Interface, Klass, TypeVariable } from "../../compiler/types/Class";
import {
  booleanPrimitiveType,
  voidPrimitiveType,
} from "../../compiler/types/PrimitiveTypes";
import { Method, Parameterlist, Value } from "../../compiler/types/Types";
import { Interpreter } from "../../interpreter/Interpreter";
import { RuntimeObject } from "../../interpreter/RuntimeObject";
import { BinaryTreeHelper } from "./BinaryTree";

export class BinarySearchTreeClass extends Klass {
  constructor(module: Module) {
    super("BinarySearchTree", module, "Generische binäre Suchbaumklasse");

    let objectType = module.typeStore.getType("Object");

    this.setBaseClass(<Klass>objectType);

    let typeA: Klass = (<Klass>objectType).clone();
    typeA.identifier = "ContentType";
    typeA.isTypeVariable = true;
    typeA.implements.push(
      <Interface>module.typeStore.getType("ComparableContent")
    );

    let tvA: TypeVariable = {
      identifier: "ContentType",
      scopeFrom: { line: 1, column: 1, length: 1 },
      scopeTo: { line: 1, column: 1, length: 1 },
      type: typeA,
    };

    this.typeVariables.push(tvA);

    this.addMethod(
      new Method(
        "BinarySearchTree",
        new Parameterlist([]),
        null,
        (parameters) => {
          let o: RuntimeObject<BinarySearchTreeHelper> = parameters[0].value;
          let h = new BinarySearchTreeHelper(o, module.main.getInterpreter());
          o.intrinsicData = h;
        },
        false,
        false,
        "Der Konstruktor erzeugt einen leeren Suchbaum.",
        true
      )
    );

    this.addMethod(
      new Method(
        "isEmpty",
        new Parameterlist([]),
        booleanPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<BinarySearchTreeHelper> = parameters[0].value;
          let h = o.intrinsicData;
          return h.isEmpty();
        },
        false,
        false,
        "Diese Anfrage liefert den Wahrheitswert true, wenn der Suchbaum leer ist, sonst liefert sie den Wert false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "insert",
        new Parameterlist([
          {
            identifier: "pContent",
            type: typeA,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<BinarySearchTreeHelper> = parameters[0].value;
          let h = o.intrinsicData;
          let content: RuntimeObject = parameters[1].value;
          h.insert(content);
        },
        false,
        false,
        "Falls bereits ein Objekt in dem Suchbaum vorhanden ist, das gleichgroß ist wie pContent, passiert nichts. Andernfalls wird das Objekt pContent entsprechend der Ordnungsrelation in den Baum eingeordnet. Falls der Parameter null ist, ändert sich nichts.",
        false
      )
    );

    this.addMethod(
      new Method(
        "search",
        new Parameterlist([
          {
            identifier: "pContent",
            type: typeA,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        typeA,
        (parameters) => {
          let o: RuntimeObject<BinarySearchTreeHelper> = parameters[0].value;
          let h = o.intrinsicData;
          return h.search(parameters[1].value);
        },
        false,
        false,
        "Falls ein Objekt im binären Suchbaum enthalten ist, das gleichgroß ist wie pContent, liefert die Anfrage dieses, ansonsten wird null zurückgegeben. Falls der Parameter null ist, wird null zurückgegeben.",
        false
      )
    );

    this.addMethod(
      new Method(
        "remove",
        new Parameterlist([
          {
            identifier: "pContent",
            type: typeA,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<BinarySearchTreeHelper> = parameters[0].value;
          let h = o.intrinsicData;
          return h.remove(parameters[1].value);
        },
        false,
        false,
        "Falls ein Objekt im binären Suchbaum enthalten ist, das gleichgroß ist wie pContent, wird dieses entfernt. Falls der Parameter null ist, ändert sich nichts.",
        false
      )
    );


    this.addMethod(
      new Method(
        "getContent",
        new Parameterlist([]),
        typeA,
        (parameters) => {
          let o: RuntimeObject<BinarySearchTreeHelper> = parameters[0].value;
          let h = o.intrinsicData;
          return h.getContent();
        },
        false,
        false,
        "Diese Anfrage liefert das Inhaltsobjekt des Suchbaumes. Wenn der Suchbaum leer ist, wird null zurückgegeben.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getLeftTree",
        new Parameterlist([]),
        this,
        (parameters) => {
          let o: RuntimeObject<BinarySearchTreeHelper> = parameters[0].value;
          let h = o.intrinsicData;
          return h.getLeftTree();
        },
        false,
        false,
        "Diese Anfrage liefert den linken Teilbaum des binären Suchbaumes. Der binäre Suchbaum ändert sich nicht. Wenn er leer ist, wird null zurückgegeben.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getRightTree",
        new Parameterlist([]),
        this,
        (parameters) => {
          let o: RuntimeObject<BinarySearchTreeHelper> = parameters[0].value;
          let h = o.intrinsicData;
          return h.getRightTree();
        },
        false,
        false,
        "Diese Anfrage liefert den rechten Teilbaum des Suchbaumes. Der Suchbaum ändert sich nicht. Wenn er leer ist, wird null zurückgegeben.",
        false
      )
    );
  }
}

class NodeHelper<T> {
  content: RuntimeObject<T> = null;
  left: RuntimeObject<BinarySearchTreeHelper> = null;
  right: RuntimeObject<BinarySearchTreeHelper> = null;
  interpreter: Interpreter;

  public constructor(
    bstO: RuntimeObject,
    pContent: RuntimeObject<T>,
    interpreter: Interpreter
  ) {
    this.content = pContent;

    const bstLeft = new RuntimeObject<BinarySearchTreeHelper>(
      bstO.class
    );
    (<Klass>bstLeft.class)
      .getMethodBySignature("BinarySearchTree()")
      .invoke?.([{ type: bstO.class, value: bstLeft }]);
    const bstRight = new RuntimeObject<BinarySearchTreeHelper>(
      bstO.class
    );
    (<Klass>bstRight.class)
      .getMethodBySignature("BinarySearchTree()")
      .invoke?.([{ type: bstO.class, value: bstRight }]);
    this.left = bstLeft;
    this.right = bstRight;
    this.interpreter = interpreter;
  }

  execute(
    method: Method,
    parameters: Value[]
  ): { error: string; value: Value } {
    if (method.invoke) {
      return {
        value: { value: method.invoke(parameters), type: method.returnType },
        error: null,
      };
    } else {
      return this.interpreter.executeImmediatelyInNewStackframe(
        method.program,
        parameters
      );
    }
  }

  isLess(o: RuntimeObject): boolean {
    const method: Method = (<Klass>this.content.class).getMethodBySignature(
      `isLess(${o.class.identifier})`
    );
    const result = this.execute(method, [
      { type: this.content.class, value: this.content },
      { type: o.class, value: o },
    ]);
    if (result.error != null) {
      this.interpreter.throwException(
        "Fehler beim Ausführen der isLess-Methode"
      );
      return false;
    }

    return result.value.value;
  }

  isGreater(o: RuntimeObject): boolean {
    const method: Method = (<Klass>this.content.class).getMethodBySignature(
      `isGreater(${o.class.identifier})`
    );
    const result = this.execute(method, [
      { type: this.content.class, value: this.content },
      { type: o.class, value: o },
    ]);
    if (result.error != null) {
      this.interpreter.throwException(
        "Fehler beim Ausführen der isGreater-Methode"
      );
      return false;
    }

    return result.value.value;
  }

  isEqual(o: RuntimeObject): boolean {
    const method: Method = (<Klass>this.content.class).getMethodBySignature(
      `isEqual(${o.class.identifier})`
    );
    const result = this.execute(method, [
      { type: this.content.class, value: this.content },
      { type: o.class, value: o },
    ]);
    if (result.error != null) {
      this.interpreter.throwException(
        "Fehler beim Ausführen der isEqual-Methode"
      );
      return false;
    }

    return result.value.value;
  }
}

export class BinarySearchTreeHelper<T = any> extends BinaryTreeHelper<T> {
  node: NodeHelper<T> = null;
  object: RuntimeObject<BinarySearchTreeHelper> = null;
  interpreter: Interpreter;

  constructor(o: RuntimeObject, interpreter: Interpreter) {
    super();
    this.object = o;
    this.interpreter = interpreter;
    this.node = null;
  }

  isEmpty(): boolean {
    return this.node == null;
  }

  insert(pContent: RuntimeObject) {
    if (pContent != null) {
      if (this.isEmpty()) {
        this.node = new NodeHelper<T>(this.object, pContent, this.interpreter);
        return;
      } else if (this.node.isLess(pContent)) {
        this.node.right.intrinsicData.insert(pContent);
      } else if (this.node.isGreater(pContent)) {
        this.node.left.intrinsicData.insert(pContent);
      }
    }
  }

  getLeftTree(): RuntimeObject<BinarySearchTreeHelper> {
    if (this.isEmpty()) {
      return null;
    } else {
      return this.node.left;
    }
  }

  getContent(): RuntimeObject {
    if (this.isEmpty()) {
      return null;
    } else {
      return this.node.content;
    }
  }

  getRightTree(): RuntimeObject<BinarySearchTreeHelper> {
    if (this.isEmpty()) {
      return null;
    } else {
      return this.node.right;
    }
  }

  remove(pContent: RuntimeObject) {
    if (this.isEmpty() || pContent == null) {
      return;
    }

    if (this.node.isGreater(pContent)) {
      this.node.left.intrinsicData.remove(pContent);
    } else if (this.node.isLess(pContent)) {
      this.node.right.intrinsicData.remove(pContent);
    } else {
      if (this.node.left.intrinsicData.isEmpty()) {
        if (this.node.right.intrinsicData.isEmpty()) {
          this.node = null;
        } else {
          this.node = this.getNodeOfRightSuccessor();
        }
      } else if (this.node.right.intrinsicData.isEmpty()) {
        this.node = this.getNodeOfLeftSuccessor();
      } else {
        if (this.getNodeOfRightSuccessor().left.intrinsicData.isEmpty()) {
          this.node.content = this.getNodeOfRightSuccessor().content;
          this.node.right = this.getNodeOfRightSuccessor().right;
        } else {
          let previous = this.node.right.intrinsicData.ancestorOfSmallRight();
          let smallest = previous.node.left;
          this.node.content = smallest.intrinsicData.node.content;
          previous.remove(smallest.intrinsicData.node.content);
        }
      }
    }
  }

  search(pContent: RuntimeObject): RuntimeObject {
    if (this.isEmpty() || pContent == null) {
      return null;
    } else {
      if (this.node.isLess(pContent)) {
        return this.getRightTree().intrinsicData.search(pContent);
      } else if (this.node.isGreater(pContent)) {
        return this.getLeftTree().intrinsicData.search(pContent);
      } else if (this.node.isEqual(pContent)) {
        return pContent;
      }
    }
    return null;
  }

  private getNodeOfLeftSuccessor(): NodeHelper<T> {
    return this.node.left.intrinsicData.node;
  }

  private getNodeOfRightSuccessor(): NodeHelper<T> {
    return this.node.right.intrinsicData.node;
  }

  private ancestorOfSmallRight(): BinarySearchTreeHelper<T> {
    if (this.getNodeOfLeftSuccessor().left.intrinsicData.isEmpty()) {
      return this;
    } else {
      return this.node.left.intrinsicData.ancestorOfSmallRight();
    }
  }
}
