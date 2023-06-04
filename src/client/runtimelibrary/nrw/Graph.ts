import { Module } from "../../compiler/parser/Module";
import { Klass } from "../../compiler/types/Class";
import { voidPrimitiveType } from "../../compiler/types/PrimitiveTypes";
import { Method, Parameterlist } from "../../compiler/types/Types";
import { RuntimeObject } from "../../interpreter/RuntimeObject";
import { ListClass, ListHelper } from "./List";

export class GraphClass extends Klass {
  constructor(module: Module) {
    super(
      "Graph",
      module,
      "Die Klasse Graph stellt einen ungerichteten, kantengewichteten Graphen dar. Es können Knoten- und Kantenobjekte hinzugefügt und entfernt, flache Kopien der Knoten- und Kantenlisten des Graphen angefragt und Markierungen von Knoten und Kanten gesetzt und überprüft werden. Des Weiteren kann eine Liste der Nachbarn eines bestimmten Knoten, eine Liste der inzidenten Kanten eines bestimmten Knoten und die Kante von einem bestimmten Knoten zu einem anderen Knoten angefragt werden. Abgesehen davon kann abgefragt werden, welches Knotenobjekt zu einer bestimmten ID gehört und ob der Graph leer ist."
    );

    let listType = <Klass>module.typeStore.getType("List");
    let objectType = <Klass>module.typeStore.getType("Object");
    let vertexType = <Klass>module.typeStore.getType("Vertex");

    this.setBaseClass(objectType);

    this.addMethod(
      new Method(
        "Graph",
        new Parameterlist([]),
        null,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let vertices: RuntimeObject = new RuntimeObject(listType);
          vertices.class
            .getMethod("List", new Parameterlist([]))
            .invoke?.([{ type: listType, value: vertices }]);
          let edges: RuntimeObject = new RuntimeObject(listType);
          edges.class
            .getMethod("List", new Parameterlist([]))
            .invoke?.([{ type: listType, value: edges }]);

          o.intrinsicData["vertices"] = vertices;
          o.intrinsicData["edges"] = edges;
        },
        false,
        false,
        "Ein Objekt vom Typ Graph wird erstellt. Der von diesem Objekt repräsentierte Graph ist leer.",
        true
      )
    );

    this.addMethod(
      new Method(
        "addVertex",
        new Parameterlist([
          {
            type: vertexType,
            identifier: "pVertex",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          let vertices: RuntimeObject = o.intrinsicData["vertices"];
          vertices.class.getMethod("append", new Parameterlist([])).invoke?.([
            {
              type: listType,
              value: vertices,
            },
            parameters[1],
          ]);
        },
        false,
        false,
        "Der Auftrag fügt den Knoten pVertex vom Typ Vertex in den Graphen ein, sofern es noch keinen Knoten mit demselben ID-Eintrag wie pVertex im Graphen gibt und pVertex eine ID ungleich null hat. Ansonsten passiert nichts.",
        false
      )
    );
  }
}
