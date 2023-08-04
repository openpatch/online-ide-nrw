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
import { NRWVertexHelper } from "./NRWVertex";

export class NRWEdgeClass extends Klass {
  constructor(module: Module) {
    super(
      "NRWEdge",
      module,
      "Ein neues Objekt vom Typ Edge wird erstellt. Die von diesem Objekt repräsentierte Kante verbindet die Knoten pVertex und pAnotherVertex mit der Gewichtung pWeight. Ihre Markierung hat den Wert false."
    );

    let objectType = module.typeStore.getType("Object");

    this.setBaseClass(<Klass>objectType);

    this.addMethod(
      new Method(
        "NRWEdge",
        new Parameterlist([
          {
            type: module.typeStore.getType("NRWVertex"),
            identifier: "pVertex",
            isFinal: true,
            usagePositions: null,
            declaration: null,
          },
          {
            type: module.typeStore.getType("NRWVertex"),
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
          let o: RuntimeObject<NRWEdgeHelper> = parameters[0].value;
          let v1: RuntimeObject<NRWVertexHelper> = parameters[1].value;
          let v2: RuntimeObject<NRWVertexHelper> = parameters[2].value;
          let eh = new NRWEdgeHelper(
            parameters[0],
            v1,
            v2,
            parameters[3].value
          );

          o.intrinsicData = eh;
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
          let o: RuntimeObject<NRWEdgeHelper> = parameters[0].value;
          let eh = o.intrinsicData;
          return eh.getWeight();
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
          let o: RuntimeObject<NRWEdgeHelper> = parameters[0].value;
          let eh = o.intrinsicData;
          eh.setWeight(parameters[1].value);
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
          let o: RuntimeObject<NRWEdgeHelper> = parameters[0].value;
          let eh = o.intrinsicData;
          eh.setMark(parameters[1].value);
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
          let o: RuntimeObject<NRWEdgeHelper> = parameters[0].value;
          let eh = o.intrinsicData;
          return eh.isMarked();
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
        new ArrayType(module.typeStore.getType("NRWVertex")),
        (parameters) => {
          let o: RuntimeObject<NRWEdgeHelper> = parameters[0].value;
          let eh = o.intrinsicData;
          return eh
            .getVertices()
            .map((v) => v.intrinsicData.getValue());
        },
        false,
        false,
        "Die Anfrage gibt die beiden Knoten, die durch die Kante verbunden werden, als neues Feld vom Typ Vertex zurück. Das Feld hat genau zwei Einträge mit den Indexwerten 0 und 1.",
        false
      )
    );
  }
}

export class NRWEdgeHelper {
  private value: Value;
  private vertices: RuntimeObject<NRWVertexHelper>[];
  private mark: boolean;
  private weight: number;

  constructor(
    value: Value,
    pVertex: RuntimeObject<NRWVertexHelper>,
    pAnotherVertex: RuntimeObject<NRWVertexHelper>,
    pWeight: number
  ) {
    this.value = value;
    this.vertices = [];
    this.vertices[0] = pVertex;
    this.vertices[1] = pAnotherVertex;
    this.weight = pWeight;
    this.mark = false;
  }

  getValue(): Value {
    return this.value;
  }

  getVertices(): RuntimeObject<NRWVertexHelper>[] {
    return this.vertices;
  }

  setWeight(pWeight: number) {
    this.weight = pWeight;
  }

  getWeight(): number {
    return this.weight;
  }

  setMark(pMark: boolean) {
    this.mark = pMark;
  }

  isMarked(): boolean {
    return this.mark;
  }
}
