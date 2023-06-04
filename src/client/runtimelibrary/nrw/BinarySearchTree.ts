import { Module } from "../../compiler/parser/Module";
import { Interface, Klass, TypeVariable } from "../../compiler/types/Class";
import {
  booleanPrimitiveType,
  voidPrimitiveType,
} from "../../compiler/types/PrimitiveTypes";
import { Method, Parameterlist, Value } from "../../compiler/types/Types";
import { RuntimeObject } from "../../interpreter/RuntimeObject";
import { BinaryTreeHelper } from "./BinaryTree";
import { ComparableContentClass } from "./ComparableContent";

export class BinarySearchTreeClass extends Klass {
  constructor(module: Module) {
    super("BinarySearchTree", module, "Generische binäre Suchbaumklasse");

    let objectType = module.typeStore.getType("Object");

    this.setBaseClass(<Klass>objectType);

    let typeA: Klass = (<Klass>objectType).clone();
    typeA.identifier = "ContentType";
    typeA.isTypeVariable = true;
    typeA.implementsInterface(<Interface>module.typeStore.getType("ComparableContent"))
    // TODO should only allow types, which extends from ComparableContent interface
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
          let o: RuntimeObject = parameters[0].value;
          let h = new BinarySearchTreeHelper();
          o.intrinsicData["BinarySearchTreeHelper"] = h;
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
          let o: RuntimeObject = parameters[0].value;
          let h: BinarySearchTreeHelper =
            o.intrinsicData["BinarySearchTreeHelper"];
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
          let o: RuntimeObject = parameters[0].value;
          let h: BinarySearchTreeHelper =
            o.intrinsicData["BinarySearchTreeHelper"];
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
          let o: RuntimeObject = parameters[0].value;
          let h: BinarySearchTreeHelper =
            o.intrinsicData["BinarySearchTreeHelper"];
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
        "getContent",
        new Parameterlist([]),
        typeA,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let h: BinarySearchTreeHelper =
            o.intrinsicData["BinarySearchTreeHelper"];
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
          let o: RuntimeObject = parameters[0].value;
          let h: BinarySearchTreeHelper =
            o.intrinsicData["BinarySearchTreeHelper"];
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
          let o: RuntimeObject = parameters[0].value;
          let h: BinarySearchTreeHelper =
            o.intrinsicData["BinarySearchTreeHelper"];
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

export class BinarySearchTreeHelper extends BinaryTreeHelper {
  insert(o: RuntimeObject) {
    const left: BinarySearchTreeHelper =
      this.left?.intrinsicData["BinarySearchTreeHelper"];
    const right: BinarySearchTreeHelper =
      this.right?.intrinsicData["BinarySearchTreeHelper"];
  }

  remove(o: RuntimeObject) {}

  search(o: RuntimeObject): RuntimeObject {
    return null;
  }
}
