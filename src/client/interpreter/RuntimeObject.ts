import { Klass, StaticClass, Visibility } from "../compiler/types/Class.js";
import { PrimitiveType, Value } from "../compiler/types/Types.js";
import { GNGAttributes } from "../runtimelibrary/gng/GNGConstants.js";



export class RuntimeObject<T extends {[classIdentifier: string]: any} = any> {

    class: Klass | StaticClass;

    intrinsicData: T = {} as T;  // for intrinsic (= builtin) classes to store data

    // Attributes of class and base-classes
    // Map class-identifier to Map <attribute-identifier, attribute-value>
    // attributeValues: Map<string, Map<string, Value>> = new Map();
    attributes: Value[];

    gngAttributes?: GNGAttributes;

    constructor(klass: Klass | StaticClass ) {

        this.class = klass;

        this.initializeAttributeValues();

    }

    getValue(attributeIndex: number):Value{

        let av: Value = this.attributes[attributeIndex];
        if(av?.updateValue != null){
            av.updateValue(av);
        }
        return av;

    }

    private initializeAttributeValues(){

        this.attributes = Array(this.class.numberOfAttributesIncludingBaseClass).fill(null);

        let klass = this.class;
        while(klass != null){

            for(let att of klass.attributes){

                let value:any = null;
                if(att.type instanceof PrimitiveType){
                    value = att.type.initialValue;
                }

                let v: Value = {
                    type: att.type,
                    value: value
                };

                if(att.updateValue != null){
                    v.updateValue = att.updateValue;
                    v.object = this;
                }

                this.attributes[att.index] = v;

            }

            klass = klass.baseClass;
        }

    }

}


export function deepCopy(obj: any): any {

    var copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");

}
