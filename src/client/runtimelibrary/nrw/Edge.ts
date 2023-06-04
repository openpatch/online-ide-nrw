import { Module } from "../../compiler/parser/Module";
import { ArrayType } from "../../compiler/types/Array";
import { Klass } from "../../compiler/types/Class";
import {
  booleanPrimitiveType,
  doublePrimitiveType,
  voidPrimitiveType,
} from "../../compiler/types/PrimitiveTypes";
import { Method, Parameterlist, Value } from "../../compiler/types/Types";
import { RuntimeObject } from "../../interpreter/RuntimeObject";

export class EdgeClass extends Klass {
  constructor(module: Module) {
    super("Edge", module, "Ein neues Objekt vom Typ Edge wird erstellt. Die von diesem Objekt repräsentierte Kante verbindet die Knoten pVertex und pAnotherVertex mit der Gewichtung pWeight. Ihre Markierung hat den Wert false.");

    let objectType = module.typeStore.getType("Object");

    this.setBaseClass(<Klass>objectType);

    this.addMethod(
      new Method(
        "Edge",
        new Parameterlist([
          {
            type: module.typeStore.getType("Vertex"),
            identifier: "pVertex",
            isFinal: true,
            usagePositions: null,
            declaration: null,
          },
          {
            type: module.typeStore.getType("Vertex"),
            identifier: "pAnotherVertex",
            isFinal: true,
            usagePositions: null,
            declaration: null,
          },
          {
            type: doublePrimitiveType,
            identifier: "pWeight",
            isFinal: true,
            usagePositions: null,
            declaration: null,
          },
        ]),
        null,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;

          let vertices: Value[] = [
            {
              type: module.typeStore.getType("Vertex"),
              value: parameters[1].value,
            },
            {
              type: module.typeStore.getType("Vertex"),
              value: parameters[2].value,
            },
          ];
          o.intrinsicData["vertices"] = vertices;

          o.intrinsicData["weight"] = parameters[3].value;
          o.intrinsicData["mark"] = false;
        },
        false,
        false,
        "Ein neues Objekt vom Typ Edge wird erstellt. Die von diesem Objekt repräsentierte Kante verbindet die Knoten pVertex und pAnotherVertex mit der Gewichtung pWeight. Ihre Markierung hat den Wert false.",
        true
      )
    );

    this.addMethod(
      new Method(
        "getWeight",
        new Parameterlist([]),
        doublePrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          return o.intrinsicData["weight"];
        },
        false,
        false,
        "Die Anfrage liefert das Gewicht der Kante als double.",
        false
      )
    );

    this.addMethod(
      new Method(
        "setWeight",
        new Parameterlist([
          {
            type: doublePrimitiveType,
            identifier: "pWeight",
            isFinal: true,
            usagePositions: null,
            declaration: null,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          o.intrinsicData["weight"] = parameters[1].value;
        },
        false,
        false,
        "Der Auftrag setzt das Gewicht der Kante auf den Wert pWeight.",
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
        "Die Anfrage liefert true, wenn die Markierung des Knotens den Wert true hat, ansonsten false.",
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

    this.addMethod(
      new Method(
        "getVertices",
        new Parameterlist([]),
        new ArrayType(module.typeStore.getType("Vertex")),
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          return o.intrinsicData["vertices"];
        },
        false,
        false,
        "Die Anfrage gibt die beiden Knoten, die durch die Kante verbunden werden, als neues Feld vom Typ Vertex zurück. Das Feld hat genau zwei Einträge mit den Indexwerten 0 und 1.",
        false
      )
    );
  }
}
