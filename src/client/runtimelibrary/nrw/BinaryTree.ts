import { Module } from "../../compiler/parser/Module";
import { Klass, TypeVariable } from "../../compiler/types/Class";
import {
  booleanPrimitiveType,
  voidPrimitiveType,
} from "../../compiler/types/PrimitiveTypes";
import { Method, Parameterlist, Value } from "../../compiler/types/Types";
import { RuntimeObject } from "../../interpreter/RuntimeObject";

export class BinaryTreeClass extends Klass {
  constructor(module: Module) {
    super("BinaryTree", module, "Generische Binärbaumklasse");

    let objectType = module.typeStore.getType("Object");

    this.setBaseClass(<Klass>objectType);

    let typeA: Klass = (<Klass>objectType).clone();
    typeA.identifier = "ContentType";
    typeA.isTypeVariable = true;

    let tvA: TypeVariable = {
      identifier: "ContentType",
      scopeFrom: { line: 1, column: 1, length: 1 },
      scopeTo: { line: 1, column: 1, length: 1 },
      type: typeA,
    };

    this.typeVariables.push(tvA);

    this.addMethod(
      new Method(
        "BinaryTree",
        new Parameterlist([]),
        null,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let h = new BinaryTreeHelper();
          o.intrinsicData["BinaryTreeHelper"] = h;
        },
        false,
        false,
        "Nach dem Aufruf des Konstruktors existiert ein leerer Binärbaum.",
        true
      )
    );

    this.addMethod(
      new Method(
        "BinaryTree",
        new Parameterlist([
          {
            identifier: "pContent",
            type: typeA,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        null,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let content: RuntimeObject = parameters[1].value;
          let h = new BinaryTreeHelper(content);
          o.intrinsicData["BinaryTreeHelper"] = h;
        },
        false,
        false,
        "Wenn der Parameter pContent ungleich null ist, existiert nach dem Aufruf des Konstruktors der Binärbaum und hat pContent als Inhaltsobjekt und zwei leere Teilbäume. Falls der Parameter null ist, wird ein leerer Binärbaum erzeugt.",
        true
      )
    );

    this.addMethod(
      new Method(
        "BinaryTree",
        new Parameterlist([
          {
            identifier: "pContent",
            type: typeA,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
          {
            identifier: "pLeftTree",
            type: this,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
          {
            identifier: "pRightTree",
            type: this,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        null,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let content: RuntimeObject = parameters[1].value;
          let left: RuntimeObject = parameters[2].value;
          let right: RuntimeObject = parameters[3].value;
          let h = new BinaryTreeHelper(content, left, right);
          o.intrinsicData["BinaryTreeHelper"] = h;
        },
        false,
        false,
        "Wenn der Parameter pContent ungleich null ist, wird ein Binärbaum mit pContent als Inhaltsobjekt und den beiden Teilbäume pLeftTree und pRightTree erzeugt. Sind pLeftTree oder pRightTree gleich null, wird der entsprechende Teilbaum als leerer Binärbaum eingefügt. Wenn der Parameter pContent gleich null ist, wird ein leerer Binärbaum erzeugt.",
        true
      )
    );

    this.addMethod(
      new Method(
        "isEmpty",
        new Parameterlist([]),
        booleanPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let h: BinaryTreeHelper = o.intrinsicData["BinaryTreeHelper"];
          return h.isEmpty();
        },
        false,
        false,
        "Diese Anfrage liefert den Wahrheitswert true, wenn der Binärbaum leer ist, sonst liefert sie den Wert false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "setContent",
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
          let o: RuntimeObject = parameters[0].value;
          let h: BinaryTreeHelper = o.intrinsicData["BinaryTreeHelper"];
          let content: RuntimeObject = parameters[1].value;
          h.setContent(content);
        },
        false,
        false,
        "Wenn der Binärbaum leer ist, werden der Parameter pContent als Inhaltsobjekt sowie ein leerer linker und rechter Teilbaum eingefügt. Ist der Binärbaum nicht leer, wird das Inhaltsobjekt durch pContent ersetzt. Die Teilbäume werden nicht geändert. Wenn pContent null ist, bleibt der Binärbaum unverändert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getContent",
        new Parameterlist([]),
        typeA,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let h: BinaryTreeHelper = o.intrinsicData["BinaryTreeHelper"];
          return h.getContent();
        },
        false,
        false,
        "Diese Anfrage liefert das Inhaltsobjekt des Binärbaums. Wenn der Binärbaum leer ist, wird null zurückgegeben",
        false
      )
    );

    this.addMethod(
      new Method(
        "setLeftTree",
        new Parameterlist([
          {
            identifier: "pTree",
            type: this,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let h: BinaryTreeHelper = o.intrinsicData["BinaryTreeHelper"];
          let o2: RuntimeObject = parameters[1].value;
          h.setLeftTree(o2);
        },
        false,
        false,
        "Wenn der Binärbaum leer ist, wird pTree nicht angehängt. Andernfalls erhält der Binärbaum den übergebenen Baum als linken Teilbaum. Falls der Parameter null ist, ändert sich nichts.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getLeftTree",
        new Parameterlist([]),
        this,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let h: BinaryTreeHelper = o.intrinsicData["BinaryTreeHelper"];
          return h.getLeftTree();
        },
        false,
        false,
        "Diese Anfrage liefert den linken Teilbaum des Binärbaumes. Der Binärbaum ändert sich nicht. Wenn der Binärbaum leer ist, wird null zurückgegeben.",
        false
      )
    );

    this.addMethod(
      new Method(
        "setRightTree",
        new Parameterlist([
          {
            identifier: "pTree",
            type: this,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let h: BinaryTreeHelper = o.intrinsicData["BinaryTreeHelper"];
          h.setRightTree(parameters[1].value.intrinsicData["BinaryTreeHelper"]);
        },
        false,
        false,
        "Wenn der Binärbaum leer ist, wird pTree nicht angehängt. Andernfalls erhält der Binärbaum den übergebenen Baum als rechter Teilbaum. Falls der Parameter null ist, ändert sich nichts.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getRightTree",
        new Parameterlist([]),
        this,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let h: BinaryTreeHelper = o.intrinsicData["BinaryTreeHelper"];
          return h.getRightTree();
        },
        false,
        false,
        "Diese Anfrage liefert den rechten Teilbaum des Binärbaumes. Der Binärbaum ändert sich nicht. Wenn der Binärbaum leer ist, wird null zurückgegeben.",
        false
      )
    );
  }
}

export class BinaryTreeHelper {
  left: RuntimeObject = null;
  right: RuntimeObject = null;
  object: RuntimeObject = null;

  constructor(
    object: RuntimeObject | null = null,
    left: RuntimeObject | null = null,
    right: RuntimeObject | null = null
  ) {
    if (object != null) {
      this.object = object;
      this.left = left;
      this.right = right;
    }
  }

  isEmpty(): boolean {
    return this.object === null;
  }

  setContent(content?: RuntimeObject) {
    if (content) {
      this.object = content;
      if (this.isEmpty()) {
        this.left = null;
        this.right = null;
      }
    }
  }

  getContent(): RuntimeObject {
    if (this.isEmpty()) {
      return null;
    } else {
      return this.object;
    }
  }

  setLeftTree(tree: RuntimeObject) {
    if (!this.isEmpty() && tree) {
      this.left = tree;
    }
  }

  setRightTree(tree: RuntimeObject) {
    if (!this.isEmpty() && tree) {
      this.right = tree;
    }
  }

  getLeftTree(): RuntimeObject {
    if (!this.isEmpty()) {
      return this.left;
    } else {
      return null;
    }
  }

  getRightTree(): RuntimeObject {
    if (!this.isEmpty()) {
      return this.right;
    } else {
      return null;
    }
  }
}
