import { Module } from "../../compiler/parser/Module.js";
import { Klass, TypeVariable } from "../../compiler/types/Class.js";
import {
  booleanPrimitiveType,
  stringPrimitiveType,
  voidPrimitiveType,
} from "../../compiler/types/PrimitiveTypes.js";
import {
  Method,
  Parameterlist,
} from "../../compiler/types/Types.js";
import { RuntimeObject } from "../../interpreter/RuntimeObject.js";
import { ListHelper } from "./List.js";

export class QueueClass extends Klass {

  constructor(module: Module) {

    super("Queue", module, "Generische Queue-Klasse");

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
        "Queue",
        new Parameterlist([]),
        null,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let lh = new ListHelper(o, module.main.getInterpreter(), module);
          o.intrinsicData = lh;
        },
        false,
        false,
        "Eine leere Schlange wird erzeugt. Objekte, die in dieser Schlange verwaltet werden, müssen vom Typ ContentType sein.",
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
          let lh: ListHelper = o.intrinsicData;
          return lh.isEmpty();
        },
        false,
        false,
        "Die Anfrage liefert den Wert true, wenn die Schlange keine Objekte enthält, sonst liefert sie den Wert false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "front",
        new Parameterlist([]),
        typeA,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let lh: ListHelper = o.intrinsicData;
          lh.toFirst();
          console.log(lh.getContent());
          return lh.getContent();
        },
        false,
        false,
        "Die Anfrage liefert das erste Objekt der Schlange. Die Schlange bleibt unverändert. Falls die Schlange leer ist, wird null zurückgegeben.",
        false
      )
    );

     this.addMethod(
      new Method(
        "dequeue",
        new Parameterlist([]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let lh: ListHelper = o.intrinsicData;
          lh.toFirst();
          lh.remove();
        },
        false,
        false,
        "Das erste Objekt wird aus der Schlange entfernt. Falls die Schlange leer ist, wird sie nicht verändert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "enqueue",
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
          let lh: ListHelper = o.intrinsicData;
          lh.append(parameters[1]);
        },
        false,
        false,
        "Das Objekt pContent wird an die Schlange angehängt. Falls pContent gleich null ist, bleibt die Schlange unverändert.",
        false
      )
    );
  }
}
export {};
