import { Vector3 } from "./vector.js";


/**
 * Creates a Triangle geometry with basic vertices and color
 * @class
 */
export class Triangle {

    constructor(vertices, color) {
        this.vertices = [];
        vertices.forEach((p, i) => {
            this.vertices[i] = p instanceof Vector3  ? p 
                : new Vector3(p[0], p[1], p[2]);
        });
        this.color = color;
    }

    static clone(tri) {
        return new Triangle(tri.vertices, tri.color);
    }

};