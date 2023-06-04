import { Module } from "../../compiler/parser/Module";
import { Klass } from "../../compiler/types/Class";
import {
  booleanPrimitiveType,
  stringPrimitiveType,
  voidPrimitiveType,
} from "../../compiler/types/PrimitiveTypes";
import { Method, Parameterlist } from "../../compiler/types/Types";
import { RuntimeObject } from "../../interpreter/RuntimeObject";

export class VertexClass extends Klass {
  constructor(module: Module) {
    super("Vertex", module, "Klasse Vertex");

    let objectType = module.typeStore.getType("Object");

    this.setBaseClass(<Klass>objectType);

    this.addMethod(
      new Method(
        "Vertex",
        new Parameterlist([
          {
            type: stringPrimitiveType,
            identifier: "pID",
            isFinal: true,
            usagePositions: null,
            declaration: null,
          },
        ]),
        null,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          o.intrinsicData["id"] = parameters[1].value;
          o.intrinsicData["mark"] = false;
        },
        false,
        false,
        "Ein neues Objekt vom Typ Vertex wird erstellt. Seine Markierung hat den Wert false.",
        true
      )
    );

    this.addMethod(
      new Method(
        "getID",
        new Parameterlist([]),
        stringPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          return o.intrinsicData["id"];
        },
        false,
        false,
        "Die Anfrage liefert die ID des Knotens als String.",
        false
      )
    );

    this.addMethod(
      new Method(
        "setMark",
        new Parameterlist([
          {
            type: booleanPrimitiveType,
            identifier: "pMark",
            isFinal: true,
            usagePositions: null,
            declaration: null,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          o.intrinsicData["mark"] = parameters[1].value;
        },
        false,
        false,
        "Der Auftrag setzt die Markierung des Knotens auf den Wert pMark.",
        false
      )
    );

    this.addMethod(
      new Method(
        "isMarked",
        new Parameterlist([]),
        booleanPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          return o.intrinsicData["mark"];
        },
        false,
        false,
        "Die Anfrage liefert true, wenn die Markierung des Knotens den Wert true hat, ansonsten false.",
        false
      )
    );
  }
}
