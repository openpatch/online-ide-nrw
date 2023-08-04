import { Module } from "../../compiler/parser/Module";
import { Klass } from "../../compiler/types/Class";
import {
  booleanPrimitiveType,
  stringPrimitiveType,
  voidPrimitiveType,
} from "../../compiler/types/PrimitiveTypes";
import { Method, Parameterlist, Value } from "../../compiler/types/Types";
import { RuntimeObject } from "../../interpreter/RuntimeObject";
import { NRWEdgeHelper } from "./NRWEdge";
import { NRWListHelper } from "./NRWList";
import { NRWVertexHelper } from "./NRWVertex";

export class NRWGraphClass extends Klass {
  constructor(module: Module) {
    super(
      "NRWGraph",
      module,
      "Die Klasse Graph stellt einen ungerichteten, kantengewichteten Graphen dar. Es können Knoten- und Kantenobjekte hinzugefügt und entfernt, flache Kopien der Knoten- und Kantenlisten des Graphen angefragt und Markierungen von Knoten und Kanten gesetzt und überprüft werden. Des Weiteren kann eine Liste der Nachbarn eines bestimmten Knoten, eine Liste der inzidenten Kanten eines bestimmten Knoten und die Kante von einem bestimmten Knoten zu einem anderen Knoten angefragt werden. Abgesehen davon kann abgefragt werden, welches Knotenobjekt zu einer bestimmten ID gehört und ob der Graph leer ist."
    );

    let objectType = <Klass>module.typeStore.getType("Object");

    let typeA: Klass = objectType.clone();
    typeA.identifier = "ContentType";
    typeA.isTypeVariable = true;

    let vertexType = <Klass>module.typeStore.getType("NRWVertex");
    let edgeType = <Klass>module.typeStore.getType("NRWEdge");

    let listVertexType = (<Klass>module.typeStore.getType("NRWList")).clone();
    listVertexType.typeVariables = [
      {
        ...listVertexType.typeVariables[0],
        type: vertexType,
      },
    ];
    let listEdgeType = (<Klass>module.typeStore.getType("NRWList")).clone();
    listEdgeType.typeVariables = [
      {
        ...listEdgeType.typeVariables[0],
        type: edgeType,
      },
    ];

    this.setBaseClass(objectType);

    this.addMethod(
      new Method(
        "NRWGraph",
        new Parameterlist([]),
        null,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;

          let vertices: RuntimeObject<NRWListHelper<NRWVertexHelper>> =
            new RuntimeObject(listVertexType);
          (<Klass>vertices.class)
            .getMethodBySignature("NRWList()")
            .invoke?.([{ type: listVertexType, value: vertices }]);

          let edges: RuntimeObject<NRWListHelper<NRWEdgeHelper>> = new RuntimeObject(
            listEdgeType
          );
          (<Klass>edges.class)
            .getMethodBySignature("NRWList()")
            .invoke?.([{ type: listEdgeType, value: edges }]);

          let gh = new NRWGraphHelper(parameters[0], vertices, edges);
          o.intrinsicData = gh;
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
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          let gh = o.intrinsicData;
          gh.addVertex(parameters[1].value);
        },
        false,
        false,
        "Der Auftrag fügt den Knoten pVertex vom Typ Vertex in den Graphen ein, sofern es noch keinen Knoten mit demselben ID-Eintrag wie pVertex im Graphen gibt und pVertex eine ID ungleich null hat. Ansonsten passiert nichts.",
        false
      )
    );

    this.addMethod(
      new Method(
        "addEdge",
        new Parameterlist([
          {
            type: edgeType,
            identifier: "pEdge",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          let newEdge: RuntimeObject<NRWEdgeHelper> = parameters[1].value;
          o.intrinsicData.addEdge(newEdge);
        },
        false,
        false,
        "Der Auftrag fügt die Kante pEdge in den Graphen ein, sofern beide durch die Kante verbundenen Knoten im Graphen enthalten sind, nicht identisch sind und noch keine Kante zwischen den beiden Knoten existiert. Ansonsten passiert nichts.",
        false
      )
    );

    this.addMethod(
      new Method(
        "removeVertex",
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
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          let oldVertex: RuntimeObject<NRWVertexHelper> = parameters[1].value;
          o.intrinsicData.removeVertex(oldVertex);
        },
        false,
        false,
        "Der Auftrag entfernt den Knoten pVertex aus dem Graphen und löscht alle Kanten, die mit ihm inzident sind. Ist der Knoten pVertex nicht im Graphen enthalten, passiert nichts.",
        false
      )
    );

    this.addMethod(
      new Method(
        "removeEdge",
        new Parameterlist([
          {
            type: edgeType,
            identifier: "pEdge",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          let oldEdge: RuntimeObject<NRWEdgeHelper> = parameters[1].value;
          o.intrinsicData.removeEdge(oldEdge);
        },
        false,
        false,
        "Der Auftrag entfernt die Kante pEdge aus dem Graphen. Ist die Kante pEdge nicht im Graphen enthalten, passiert nichts.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getVertex",
        new Parameterlist([
          {
            type: stringPrimitiveType,
            identifier: "pID",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
        ]),
        vertexType,
        (parameters) => {
          let o: RuntimeObject = parameters[0].value;
          return o.intrinsicData.getVertex(parameters[1].value);
        },
        false,
        false,
        "Die Anfrage liefert das Knotenobjekt mit pID als ID. Ist ein solches Knotenobjekt nicht im Graphen enthalten, wird null zurückgeliefert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getVertices",
        new Parameterlist([]),
        listVertexType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          return o.intrinsicData.getVertices();
        },
        false,
        false,
        "Die Anfrage liefert eine neue Liste aller Knotenobjekte vom Typ List<Vertex>. Enthält der Graph keine Knotenobjekte, so wird eine leere Liste zurückgeliefert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getNeighbours",
        new Parameterlist([
          {
            type: vertexType,
            identifier: "pVertex",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
        ]),
        listVertexType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          let vertex: RuntimeObject<NRWVertexHelper> = parameters[1].value;
          return o.intrinsicData.getNeighbours(vertex);
        },
        false,
        false,
        "Die Anfrage liefert alle Nachbarn des Knotens pVertex als neue Liste vom Typ List<Vertex>. Hat der Knoten pVertex keine Nachbarn in diesem Graphen oder ist gar nicht in diesem Graphen enthalten, so wird eine leere Liste zurückgeliefert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getEdges",
        new Parameterlist([]),
        listEdgeType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          return o.intrinsicData.getEdges();
        },
        false,
        false,
        "Die Anfrage liefert eine neue Liste aller Kantenobjekte vom Typ List<Edge>. Enthält der Graph keine Kantenobjekte, so wird eine leere Liste zurückgeliefert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getEdges",
        new Parameterlist([
          {
            type: vertexType,
            identifier: "pVertex",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
        ]),
        listEdgeType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          let vertex: RuntimeObject<NRWVertexHelper> = parameters[1].value;
          return o.intrinsicData.getEdges(vertex);
        },
        false,
        false,
        "Die Anfrage liefert eine neue Liste aller inzidenten Kanten zum Knoten pVertex. Hat der Knoten pVertex keine inzidenten Kanten in diesem Graphen oder ist gar nicht in diesem Graphen enthalten, so wird eine leere Liste zurückgeliefert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "getEdge",
        new Parameterlist([
          {
            type: vertexType,
            identifier: "pVertex",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
          {
            type: vertexType,
            identifier: "pAnotherVertex",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
        ]),
        listEdgeType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          let vertex1: RuntimeObject<NRWVertexHelper> = parameters[1].value;
          let vertex2: RuntimeObject<NRWVertexHelper> = parameters[2].value;
          return o.intrinsicData.getEdge(vertex1, vertex2);
        },
        false,
        false,
        "Die Anfrage liefert die Kante, welche die Knoten pVertex und pAnotherVertex verbindet, als Objekt vom Typ Edge. Ist der Knoten pVertex oder der Knoten pAnotherVertex nicht im Graphen enthalten oder gibt es keine Kante, die beide Knoten verbindet, so wird null zurückgeliefert.",
        false
      )
    );

    this.addMethod(
      new Method(
        "setAllVertexMarks",
        new Parameterlist([
          {
            type: booleanPrimitiveType,
            identifier: "pMark",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          o.intrinsicData.setAllVertexMarks(parameters[1].value);
        },
        false,
        false,
        "Der Auftrag setzt die Markierungen aller Knoten des Graphen auf den Wert pMark.",
        false
      )
    );

    this.addMethod(
      new Method(
        "allVerticesMarked",
        new Parameterlist([]),
        booleanPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          return o.intrinsicData.allVerticesMarked();
        },
        false,
        false,
        "Die Anfrage liefert true, wenn die Markierungen aller Knoten des Graphen den Wert true haben, ansonsten false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "setAllEdgeMarks",
        new Parameterlist([
          {
            type: booleanPrimitiveType,
            identifier: "pMark",
            usagePositions: null,
            isFinal: true,
            declaration: null,
          },
        ]),
        voidPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          o.intrinsicData.setAllEdgeMarks(parameters[1].value);
        },
        false,
        false,
        "Der Auftrag setzt die Markierungen aller Kanten des Graphen auf den Wert pMark.",
        false
      )
    );

    this.addMethod(
      new Method(
        "allEdgesMarked",
        new Parameterlist([]),
        booleanPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          return o.intrinsicData.allEdgesMarked();
        },
        false,
        false,
        "Die Anfrage liefert true, wenn die Markierungen aller Kanten des Graphen den Wert true haben, ansonsten false.",
        false
      )
    );

    this.addMethod(
      new Method(
        "isEmpty",
        new Parameterlist([]),
        booleanPrimitiveType,
        (parameters) => {
          let o: RuntimeObject<NRWGraphHelper> = parameters[0].value;
          return o.intrinsicData.isEmpty();
        },
        false,
        false,
        "Die Anfrage liefert true, wenn der Graph keine Knoten enthält, ansonsten false.",
        false
      )
    );
  }
}

export class NRWGraphHelper {
  private value: Value;
  private vertices: RuntimeObject<NRWListHelper<NRWVertexHelper>>;
  private edges: RuntimeObject<NRWListHelper<NRWEdgeHelper>>;

  constructor(
    value: Value,
    vertices: RuntimeObject<NRWListHelper<NRWVertexHelper>>,
    edges: RuntimeObject<NRWListHelper<NRWEdgeHelper>>
  ) {
    this.value = value;
    this.vertices = vertices;
    this.edges = edges;
  }

  getValue(): Value {
    return this.value;
  }

  getVertices(): RuntimeObject<NRWListHelper<NRWVertexHelper>> {
    const result = new RuntimeObject<NRWListHelper<NRWVertexHelper>>(
      this.vertices.class
    );
    (<Klass>result.class)
      .getMethodBySignature("List()")
      .invoke?.([{ type: this.vertices.class, value: result }]);
    this.vertices.intrinsicData.toFirst();
    while (this.vertices.intrinsicData.hasAccess()) {
      result.intrinsicData.append(
        this.vertices.intrinsicData.getContent().intrinsicData.getValue()
      );
      this.vertices.intrinsicData.next();
    }
    result.intrinsicData.toFirst();
    return result;
  }

  getEdges(
    pVertex?: RuntimeObject<NRWVertexHelper>
  ): RuntimeObject<NRWListHelper<NRWEdgeHelper>> {
    if (pVertex) {
      return this.getEdges2(pVertex);
    }
    const result = new RuntimeObject<NRWListHelper<NRWEdgeHelper>>(this.edges.class);
    (<Klass>result.class)
      .getMethodBySignature("List()")
      .invoke?.([{ type: this.edges.class, value: result }]);
    this.edges.intrinsicData.toFirst();
    while (this.edges.intrinsicData.hasAccess()) {
      result.intrinsicData.append(
        this.edges.intrinsicData.getContent().intrinsicData.getValue()
      );
      this.edges.intrinsicData.next();
    }
    result.intrinsicData.toFirst();
    return result;
  }

  getEdges2(
    pVertex: RuntimeObject<NRWVertexHelper>
  ): RuntimeObject<NRWListHelper<NRWEdgeHelper>> {
    const result = new RuntimeObject<NRWListHelper<NRWEdgeHelper>>(this.edges.class);
    (<Klass>result.class)
      .getMethodBySignature("List()")
      .invoke?.([{ type: this.edges.class, value: result }]);
    this.edges.intrinsicData.toFirst();
    while (this.edges.intrinsicData.hasAccess()) {
      const vertexPair = this.edges.intrinsicData
        .getContent()
        .intrinsicData.getVertices();
      if (vertexPair[0] == pVertex) {
        result.intrinsicData.append(
          this.edges.intrinsicData.getContent().intrinsicData.getValue()
        );
      } else if (vertexPair[1] == pVertex) {
        result.intrinsicData.append(
          this.edges.intrinsicData.getContent().intrinsicData.getValue()
        );
      }
      this.edges.intrinsicData.next();
    }
    return result;
  }

  getVertex(pID: string): RuntimeObject<NRWVertexHelper> {
    let result: RuntimeObject<NRWVertexHelper> = null;
    this.vertices.intrinsicData.toFirst();
    while (this.vertices.intrinsicData.hasAccess() && result == null) {
      if (
        this.vertices.intrinsicData.getContent().intrinsicData.getID() == pID
      ) {
        result = this.vertices.intrinsicData.getContent();
      }
      this.vertices.intrinsicData.next();
    }
    return result;
  }

  addVertex(pVertex: RuntimeObject<NRWVertexHelper>) {
    if (pVertex != null && pVertex.intrinsicData.getID() != null) {
      let freeID = true;
      this.vertices.intrinsicData.toFirst();
      while (this.vertices.intrinsicData.hasAccess() && freeID) {
        if (
          this.vertices.intrinsicData.getContent().intrinsicData.getID() ==
          pVertex.intrinsicData.getID()
        ) {
          freeID = false;
        }
        this.vertices.intrinsicData.next();
      }
      if (freeID) {
        this.vertices.intrinsicData.append(pVertex.intrinsicData.getValue());
      }
    }
  }

  addEdge(pEdge: RuntimeObject<NRWEdgeHelper>) {
    if (pEdge != null) {
      const vertexPair = pEdge.intrinsicData.getVertices();
      if (
        vertexPair[0] != null &&
        vertexPair[1] != null &&
        this.getVertex(vertexPair[0].intrinsicData.getID()) == vertexPair[0] &&
        this.getVertex(vertexPair[1].intrinsicData.getID()) == vertexPair[1] &&
        this.getEdge(vertexPair[0], vertexPair[1]) == null &&
        vertexPair[0] != vertexPair[1]
      ) {
        this.edges.intrinsicData.append(pEdge.intrinsicData.getValue());
      }
    }
    this.edges.intrinsicData.append(pEdge.intrinsicData.getValue());
  }

  removeVertex(pVertex: RuntimeObject<NRWVertexHelper>) {
    this.edges.intrinsicData.toFirst();
    while (this.edges.intrinsicData.hasAccess()) {
      let akt = this.edges.intrinsicData
        .getContent()
        .intrinsicData.getVertices();
      if (akt[0] == pVertex || akt[1] == pVertex) {
        this.edges.intrinsicData.remove();
      } else {
        this.edges.intrinsicData.next();
      }
    }

    this.vertices.intrinsicData.toFirst();
    while (
      this.vertices.intrinsicData.hasAccess() &&
      this.vertices.intrinsicData.getContent() != pVertex
    ) {
      this.vertices.intrinsicData.next();
    }
    if (this.vertices.intrinsicData.hasAccess()) {
      this.vertices.intrinsicData.remove();
    }
  }

  removeEdge(pEdge: RuntimeObject<NRWEdgeHelper>) {
    this.edges.intrinsicData.toFirst();
    while (this.edges.intrinsicData.hasAccess()) {
      if (this.edges.intrinsicData.getContent() == pEdge) {
        this.edges.intrinsicData.remove();
      } else {
        this.edges.intrinsicData.next();
      }
    }
  }

  setAllVertexMarks(pMark: boolean) {
    this.vertices.intrinsicData.toFirst();
    while (this.vertices.intrinsicData.hasAccess()) {
      this.vertices.intrinsicData.getContent().intrinsicData.setMark(pMark);
      this.vertices.intrinsicData.next();
    }
  }

  setAllEdgeMarks(pMark: boolean) {
    this.edges.intrinsicData.toFirst();
    while (this.edges.intrinsicData.hasAccess()) {
      this.edges.intrinsicData.getContent().intrinsicData.setMark(pMark);
      this.edges.intrinsicData.next();
    }
  }

  allVerticesMarked(): boolean {
    this.vertices.intrinsicData.toFirst();
    while (this.vertices.intrinsicData.hasAccess()) {
      if (!this.vertices.intrinsicData.getContent().intrinsicData.isMarked()) {
        return false;
      }
      this.vertices.intrinsicData.next();
    }
    return true;
  }

  allEdgesMarked(): boolean {
    this.edges.intrinsicData.toFirst();
    while (this.edges.intrinsicData.hasAccess()) {
      if (!this.edges.intrinsicData.getContent().intrinsicData.isMarked()) {
        return false;
      }
      this.edges.intrinsicData.next();
    }
    return true;
  }

  getNeighbours(
    pVertex: RuntimeObject<NRWVertexHelper>
  ): RuntimeObject<NRWListHelper<NRWVertexHelper>> {
    let result = new RuntimeObject<NRWListHelper<NRWVertexHelper>>(
      this.vertices.class
    );
    (<Klass>result.class)
      .getMethodBySignature("List()")
      .invoke?.([{ type: this.vertices.class, value: result }]);
    this.edges.intrinsicData.toFirst();
    while (this.edges.intrinsicData.hasAccess()) {
      const vertexPair = this.edges.intrinsicData
        .getContent()
        .intrinsicData.getVertices();
      if (vertexPair[0] == pVertex) {
        result.intrinsicData.append(vertexPair[1].intrinsicData.getValue());
      } else if (vertexPair[1] == pVertex) {
        result.intrinsicData.append(vertexPair[0].intrinsicData.getValue());
      }
      this.edges.intrinsicData.next();
    }
    return result;
  }

  getEdge(
    pVertex: RuntimeObject<NRWVertexHelper>,
    pAnotherVertex: RuntimeObject<NRWVertexHelper>
  ): RuntimeObject<NRWEdgeHelper> {
    let result: RuntimeObject<NRWEdgeHelper> = null;

    this.edges.intrinsicData.toFirst();
    while (this.edges.intrinsicData.hasAccess() && result == null) {
      const vertexPair = this.edges.intrinsicData
        .getContent()
        .intrinsicData.getVertices();
      if (
        (vertexPair[0] == pVertex && vertexPair[1] == pAnotherVertex) ||
        (vertexPair[0] == pAnotherVertex && vertexPair[1] == pVertex)
      ) {
        result = this.edges.intrinsicData.getContent();
      }
      this.edges.intrinsicData.next();
    }
    return result;
  }

  isEmpty(): boolean {
    return this.vertices.intrinsicData.isEmpty();
  }
}
