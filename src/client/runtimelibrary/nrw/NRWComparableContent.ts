import { Module } from "../../compiler/parser/Module.js";
import { Method, Parameterlist } from "../../compiler/types/Types.js";
import { Interface, TypeVariable, Klass } from "../../compiler/types/Class.js";
import {
  booleanPrimitiveType,
} from "../../compiler/types/PrimitiveTypes.js";

export class NRWComparableContentClass extends Interface {
  constructor(module: Module) {
    super(
      "NRWComparableContent",
      module,
      "Interface mit Methoden zum Vergleichen von Objekten."
    );

    let objectType = module.typeStore.getType("Object");

    let typeE: Klass = (<Klass>objectType).clone();
    typeE.identifier = "ContentType";
    typeE.isTypeVariable = true;

    let tvE: TypeVariable = {
      identifier: "ContentType",
      scopeFrom: { line: 1, column: 1, length: 1 },
      scopeTo: { line: 1, column: 1, length: 1 },
      type: typeE,
    };

    this.typeVariables.push(tvE);

    this.addMethod(
      new Method(
        "isGreater",
        new Parameterlist([
          {
            identifier: "pComparableContent",
            type: typeE,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        booleanPrimitiveType,
        null, // no implementation!
        true,
        false,
        "Wenn festgestellt wird, dass das Objekt, von dem die Methode aufgerufen wird, bzgl. der gewünschten Ordnungsrelation größer als das Objekt pComparableContent ist, wird true geliefert. Sonst wird false geliefert."
      )
    );

    this.addMethod(
      new Method(
        "isEqual",
        new Parameterlist([
          {
            identifier: "pComparableContent",
            type: typeE,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        booleanPrimitiveType,
        null, // no implementation!
        true,
        false,
        "Wenn festgestellt wird, dass das Objekt, von dem die Methode aufgerufen wird, bzgl. der gewünschten Ordnungsrelation gleich dem Objekt pComparableContent ist, wird true geliefert. Sonst wird false geliefert."
      )
    );

    this.addMethod(
      new Method(
        "isLess",
        new Parameterlist([
          {
            identifier: "pComparableContent",
            type: typeE,
            declaration: null,
            usagePositions: null,
            isFinal: true,
          },
        ]),
        booleanPrimitiveType,
        null, // no implementation!
        true,
        false,
        "Wenn festgestellt wird, dass das Objekt, von dem die Methode aufgerufen wird, bzgl. der gewünschten Ordnungsrelation kleiner als das Objekt pComparableContent ist, wird true geliefert. Sonst wird false geliefert."
      )
    );
  }
}
