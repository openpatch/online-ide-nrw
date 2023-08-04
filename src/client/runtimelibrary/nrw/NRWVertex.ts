import { Module } from "../../compiler/parser/Module";
import { Interface, Klass } from "../../compiler/types/Class";
import { Enum } from "../../compiler/types/Enum";
import {
  booleanPrimitiveType,
  stringPrimitiveType,
  voidPrimitiveType,
} from "../../compiler/types/PrimitiveTypes";
import { Method, Parameterlist, Value } from "../../compiler/types/Types";
import { RuntimeObject } from "../../interpreter/RuntimeObject";

export class NRWVertexClass extends Klass {
  constructor(module: Module) {
    super(
      "NRWVertex",
      module,
      "Die Klasse Vertex stellt einen einzelnen Knoten eines Graphen dar. Jedes Objekt dieser Klasse verfügt über eine im Graphen eindeutige ID als String und kann diese ID zurückliefern. Darüber hinaus kann eine Markierung gesetzt und abgefragt werden."
    );

    let objectType = module.typeStore.getType("Object");

    this.setBaseClass(<Klass>objectType);

    this.addMethod(
      new Method(
        "NRWVertex",
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
          let o: RuntimeObject<NRWVertexHelper> = parameters[0].value;
          o.intrinsicData = new NRWVertexHelper(
            parameters[0],
            parameters[1].value
          );
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
          let o: RuntimeObject<NRWVertexHelper> = parameters[0].value;
          return o.intrinsicData.getID();
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
          let o: RuntimeObject<NRWVertexHelper> = parameters[0].value;
          o.intrinsicData.setMark(parameters[1].value);
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
          let o: RuntimeObject<NRWVertexHelper> = parameters[0].value;
          return o.intrinsicData.isMarked();
        },
        false,
        false,
        "Die Anfrage liefert true, wenn die Markierung des Knotens den Wert true hat, ansonsten false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "toString",
        new Parameterlist([]),
        stringPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWVertexHelper> = parameters[0].value;
          return o.intrinsicData.toString();
        },
        false,
        false,
        "",
        false
      )
    );
  }
}

export class NRWVertexHelper {
  private value: Value;
  private id: string;
  private mark: boolean;

  constructor(value: Value, id: string) {
    this.value = value;
    this.id = id;
    this.mark = false;
  }

  getID(): string {
    return this.id;
  }

  setMark(pMark: boolean) {
    this.mark = pMark;
  }

  isMarked(): boolean {
    return this.mark;
  }

  getValue(): Value {
    return this.value;
  }

  toString(): string {
    return `Vertex ${this.id} ${this.mark ? "✔" : "❌"}`;
  }
}
