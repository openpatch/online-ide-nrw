import { Klass } from "../../compiler/types/Class";
import { RuntimeObject } from "../../interpreter/RuntimeObject";

export class GraphClass extends Klass {
};

export class GraphHelper {
  vertices: RuntimeObject[] = [];
  edges: RuntimeObject[] = [];
}
