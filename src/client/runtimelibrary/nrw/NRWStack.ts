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
import { NRWListHelper } from "./NRWList.js";

export class NRWStackClass extends Klass {

  constructor(module: Module) {

    super("NRWStack", module, "Generische Stack-Klasse");

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
        "NRWStack",
        new Parameterlist([]),
        null,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let lh = new NRWListHelper(o, module.main.getInterpreter(), module);
          o.intrinsicData = lh;
        },
        false,
        false,
        "Ein leerer Stapel wird erzeugt. Objekte, die in diesem Stapel verwaltet werden, müssen vom Typ ContentType sein.",
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
          let lh: NRWListHelper = o.intrinsicData;
          return lh.isEmpty();
        },
        false,
        false,
        "Die Anfrage liefert den Wert true, wenn der Stapel keine Objekte enthält, sonst liefert sie den Wert false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "top",
        new Parameterlist([]),
        typeA,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let lh: NRWListHelper = o.intrinsicData;
          lh.toLast();
          return lh.getContent();
        },
        false,
        false,
        "Die Anfrage liefert das oberste Stapelobjekt. Der Stapel bleibt unverändert. Falls der Stapel leer ist, wird null zurückgegebe",
        false
      )
    );

     this.addMethod(
      new Method(
        "pop",
        new Parameterlist([]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let lh: NRWListHelper = o.intrinsicData;
          lh.toLast();
          lh.remove();
        },
        false,
        false,
        "Das zuletzt eingefügte Objekt wird von dem Stapel entfernt. Falls der Stapel leer ist, bleibt er unverändert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "push",
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
          let lh: NRWListHelper = o.intrinsicData;
          lh.append(parameters[1]);
        },
        false,
        false,
        "Das Objekt pContent wird oben auf den Stapel gelegt. Falls pContent gleich null ist, bleibt der Stapel unverändert. ",
        false
      )
    );
  }
}
