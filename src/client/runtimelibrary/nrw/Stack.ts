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

export class StackClass extends Klass {

  constructor(module: Module) {

    super("Stack", module, "Generische Stackklasse");

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
        "Stack",
        new Parameterlist([]),
        null,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let lh = new ListHelper(o, module.main.getInterpreter(), module);
          o.intrinsicData["ListHelper"] = lh;
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
          let lh: ListHelper = o.intrinsicData["ListHelper"];
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
          let lh: ListHelper = o.intrinsicData["ListHelper"];
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
          let lh: ListHelper = o.intrinsicData["ListHelper"];
          lh.pop();
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
          let lh: ListHelper = o.intrinsicData["ListHelper"];
          lh.append(parameters[0].value);
        },
        false,
        false,
        "Das Objekt pContent wird oben auf den Stapel gelegt. Falls pContent gleich null ist, bleibt der Stapel unverändert. ",
        false
      )
    );

    this.addMethod(
      new Method(
        "toString",
        new Parameterlist([]),
        stringPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let lh: ListHelper = o.intrinsicData["ListHelper"];
          return lh.to_String();
        },
        false,
        false
      )
    );
  }
}

export class ListHelper {
  valueArray: Value[] = [];
  objectArray: any[] = []; // wird mitgeführt, um schnelle indexOf-Operationen zu ermöglichen
  current: number = -1;

  constructor(
    private runtimeObject: RuntimeObject,
    public interpreter: Interpreter,
    private module: Module
  ) {}

  isEmpty() {
    return this.valueArray.length === 0;
  }

  top() {
    return this.objectArray[this.current];
  }

  front(v: Value) {
    if (this.hasAccess()) {
      this.valueArray[this.current] = v;
      this.objectArray[this.current] = v.value;
    }
  }

  push(v: Value) {
    if (v.type !== nullType) {
      this.valueArray.push(v);
      this.objectArray.push(v.value);
    }
  }

  //remove() {
    //if (this.hasAccess()) {
      //this.valueArray.splice(this.current, 1);
      //this.objectArray.splice(this.current, 1);
    //}
  //}

  // copied form ListHelper
  to_String(): any {
    if (this.allElementsPrimitive()) {
      return "[" + this.objectArray.map((o) => "" + o).join(", ") + "]";
    }

    let position: TextPosition = {
      line: 1,
      column: 1,
      length: 1,
    };

    let statements: Statement[] = [
      {
        type: TokenType.noOp,
        position: position,
        stepFinished: false,
      },
      {
        type: TokenType.pushConstant,
        dataType: stringPrimitiveType,
        value: "[",
        position: position,
        stepFinished: false,
      },
    ];

    let toStringParameters = new Parameterlist([]);

    for (let i = 0; i < this.valueArray.length; i++) {
      let value = this.valueArray[i];
      if (
        value.value == null ||
        value.type instanceof PrimitiveType ||
        value.type instanceof StringPrimitiveType
      ) {
        statements.push({
          type: TokenType.pushConstant,
          dataType: stringPrimitiveType,
          value:
            value.value == null
              ? "null"
              : value.type.castTo(value, stringPrimitiveType).value,
          position: position,
          stepFinished: false,
        });
      } else {
        statements.push({
          type: TokenType.pushConstant,
          dataType: value.type,
          value: value.value,
          stepFinished: false,
          position: position,
        });
        statements.push({
          type: TokenType.callMethod,
          method: (<Klass | Interface | Enum>value.type).getMethod(
            "toString",
            toStringParameters
          ),
          isSuperCall: false,
          stackframeBegin: -1,
          stepFinished: false,
          position: position,
        });
      }

      statements.push({
        type: TokenType.binaryOp,
        operator: TokenType.plus,
        leftType: stringPrimitiveType,
        stepFinished: false,
        position: position,
      });

      if (i < this.valueArray.length - 1) {
        statements.push({
          type: TokenType.pushConstant,
          dataType: stringPrimitiveType,
          value: ", ",
          position: position,
          stepFinished: false,
        });
        statements.push({
          type: TokenType.binaryOp,
          operator: TokenType.plus,
          leftType: stringPrimitiveType,
          stepFinished: false,
          position: position,
        });
      }
    }

    statements.push({
      type: TokenType.pushConstant,
      dataType: stringPrimitiveType,
      value: "]",
      position: position,
      stepFinished: false,
    });

    statements.push({
      type: TokenType.binaryOp,
      operator: TokenType.plus,
      leftType: stringPrimitiveType,
      stepFinished: false,
      position: position,
    });

    // statements.push({
    //     type: TokenType.binaryOp,
    //     operator: TokenType.plus,
    //     leftType: stringPrimitiveType,
    //     stepFinished: false,
    //     position: position
    // });

    statements.push({
      type: TokenType.return,
      copyReturnValueToStackframePos0: true,
      leaveThisObjectOnStack: false,
      stepFinished: false,
      position: position,
      methodWasInjected: true,
    });

    let program: Program = {
      module: this.module,
      statements: statements,
      labelManager: null,
    };

    let method: Method = new Method(
      "toString",
      new Parameterlist([]),
      stringPrimitiveType,
      program,
      false,
      false
    );
    this.interpreter.runTimer(method, [], () => {}, true);

    return "";
  }

  // is needed for the debug modus
  allElementsPrimitive(): boolean {
    for (let v of this.valueArray) {
      if (
        !(
          v.type instanceof PrimitiveType ||
          ["String", "_Double", "Integer", "Boolean", "Character"].indexOf(
            v.type.identifier
          ) >= 0
        )
      ) {
        return false;
      }
    }
    return true;
  }
}
