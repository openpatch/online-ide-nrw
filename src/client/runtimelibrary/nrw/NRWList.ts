import { TextPosition, TokenType } from "../../compiler/lexer/Token.js";
import { Module } from "../../compiler/parser/Module.js";
import { Program, Statement } from "../../compiler/parser/Program.js";
import { Interface, Klass, TypeVariable } from "../../compiler/types/Class.js";
import { Enum } from "../../compiler/types/Enum.js";
import {
  booleanPrimitiveType,
  nullType,
  StringPrimitiveType,
  stringPrimitiveType,
  voidPrimitiveType,
} from "../../compiler/types/PrimitiveTypes.js";
import {
  Method,
  Parameterlist,
  PrimitiveType,
  Value,
} from "../../compiler/types/Types.js";
import { Interpreter } from "../../interpreter/Interpreter.js";
import { RuntimeObject } from "../../interpreter/RuntimeObject.js";

export class NRWListClass extends Klass {
  constructor(module: Module) {
    super("NRWList", module, "Generische Listenklasse");

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
        "NRWList",
        new Parameterlist([]),
        null,
        (parameters) => {
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          let lh = new NRWListHelper(o, module.main.getInterpreter(), module);
          o.intrinsicData = lh;
        },
        false,
        false,
        "Eine leere Liste wird erzeugt.",
        true
      )
    );

    this.addMethod(
      new Method(
        "isEmpty",
        new Parameterlist([]),
        booleanPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          return o.intrinsicData.isEmpty();
        },
        false,
        false,
        "Die Anfrage liefert den Wert true, wenn die Liste keine Objekte enthält, sonst liefert sie den Wert false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "hasAccess",
        new Parameterlist([]),
        booleanPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          return o.intrinsicData.hasAccess();
        },
        false,
        false,
        "Die Anfrage liefert den Wert true, wenn es ein aktuelles Objekt gibt, sonst liefert sie den Wert false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "next",
        new Parameterlist([]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          o.intrinsicData.next();
        },
        false,
        false,
        "Falls die Liste nicht leer ist, es ein aktuelles Objekt gibt und dieses nicht das letzte Objekt der Liste ist, wird das dem aktuellen Objekt in der Liste folgende Objekt zum aktuellen Objekt, andernfalls gibt es nach Ausführung des Auftrags kein aktuelles Objekt, d. h. hasAccess() liefert den Wert false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "toFirst",
        new Parameterlist([]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          o.intrinsicData.toFirst();
        },
        false,
        false,
        "Falls die Liste nicht leer ist, wird das erste Objekt der Liste aktuelles Objekt. Ist die Liste leer, geschieht nichts.",
        false
      )
    );

    this.addMethod(
      new Method(
        "toLast",
        new Parameterlist([]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          o.intrinsicData.toLast();
        },
        false,
        false,
        "Falls die Liste nicht leer ist, wird das letzte Objekt der Liste aktuelles Objekt. Ist die Liste leer, geschieht nichts.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getContent",
        new Parameterlist([]),
        typeA,
        (parameters) => {
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          return o.intrinsicData.getContent();
        },
        false,
        false,
        "Falls es ein aktuelles Objekt gibt (hasAccess() == true), wird das aktuelle Objekt zurückgegeben. Andernfalls (hasAccess() == false) gibt die Anfrage den Wert null zurück.",
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
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          o.intrinsicData.setContent(parameters[1]);
        },
        false,
        false,
        "Falls es ein aktuelles Objekt gibt (hasAccess() == true) und pContent ungleich null ist, wird das aktuelle Objekt durch pContent ersetzt. Sonst bleibt die Liste unverändert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "append",
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
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          o.intrinsicData.append(parameters[1]);
        },
        false,
        false,
        "Ein neues Objekt pContent wird am Ende der Liste eingefügt. Das aktuelle Objekt bleibt unverändert. Wenn die Liste leer ist, wird das Objekt pContent in die Liste eingefügt und es gibt weiterhin kein aktuelles Objekt (hasAccess() == false). Falls pContent gleich null ist, bleibt die Liste unverändert.",
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
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          o.intrinsicData.insert(parameters[1]);
        },
        false,
        false,
        "Falls es ein aktuelles Objekt gibt (hasAccess() == true), wird ein neues Objekt pContent vor dem aktuellen Objekt in die Liste eingefügt. Das aktuelle Objekt bleibt unverändert. Falls die Liste leer ist und es somit kein aktuelles Objekt gibt (hasAccess() == false), wird pContent in die Liste eingefügt und es gibt weiterhin kein aktuelles Objekt. Falls es kein aktuelles Objekt gibt (hasAccess() == false) und die Liste nicht leer ist oder pContent == null ist, bleibt die Liste unverändert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "concat",
        new Parameterlist([
          {
            identifier: "pList",
            type: this,
            declaration: null,
            usagePositions: null,
            isFinal: null,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          o.intrinsicData.concat(parameters[1]);
        },
        false,
        false,
        "Die Liste pList wird an die Liste angehängt. Anschließend wird pList eine leere Liste. Das aktuelle Objekt bleibt unverändert. Falls es sich bei der Liste und pList um dasselbe Objekt handelt, pList == null oder eine leere Liste ist, bleibt die Liste unverändert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "remove",
        new Parameterlist([]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWListHelper> = parameters[0].value;
          o.intrinsicData.remove();
        },
        false,
        false,
        "Falls es ein aktuelles Objekt gibt (hasAccess() == true), wird das aktuelle Objekt gelöscht und das Objekt hinter dem gelöschten Objekt wird zum aktuellen Objekt. Wird das Objekt, das am Ende der Liste steht, gelöscht, gibt es kein aktuelles Objekt mehr (hasAccess() == false). Wenn die Liste leer ist oder es kein aktuelles Objekt gibt (hasAccess() == false), bleibt die Liste unverändert.",
        false
      )
    );
  }
}

export class NRWListHelper<T = any> {
  valueArray: Value[] = [];
  objectArray: RuntimeObject<T>[] = []; // wird mitgeführt, um schnelle indexOf-Operationen zu ermöglichen
  current: number = -1;

  constructor(
    private runtimeObject: RuntimeObject,
    public interpreter: Interpreter,
    private module: Module
  ) {}

  isEmpty() {
    return this.valueArray.length === 0;
  }

  hasAccess() {
    return this.getContent() !== undefined;
  }

  next() {
    this.current += 1;
  }

  toFirst() {
    if (this.valueArray.length > 0) {
      this.current = 0;
    }
  }

  toLast() {
    if (this.valueArray.length > 0) {
      this.current = this.valueArray.length - 1;
    }
  }

  getValue() {
    return this.valueArray[this.current];
  }

  getContent() {
    return this.objectArray[this.current];
  }

  setContent(v: Value) {
    if (this.hasAccess()) {
      this.valueArray[this.current] = v;
      this.objectArray[this.current] = v.value;
    }
  }

  append(v: Value) {
    if (v.type !== nullType) {
      if (this.isEmpty()) {
        this.current = 0;
      }
      this.valueArray.push(v);
      this.objectArray.push(v.value);
    }
  }

  insert(v: Value) {
    if (v.type !== nullType) {
      if (this.current > -1) {
        this.valueArray.splice(this.current, 0, v);
        this.objectArray.splice(this.current, 0, v.value);
      }
    }
  }

  concat(v: Value) {
    if (v.type !== nullType) {
      let o: RuntimeObject = v.value;
      let lh: NRWListHelper = o.intrinsicData;
      this.valueArray = [...this.valueArray, ...lh.valueArray];
      this.objectArray = [...this.objectArray, ...lh.objectArray];
    }
  }

  remove() {
    if (this.hasAccess()) {
      this.valueArray.splice(this.current, 1);
      this.objectArray.splice(this.current, 1);
    }
  }
}