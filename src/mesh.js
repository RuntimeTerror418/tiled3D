import { Mat4x4 } from "./matrices.js";
import { Vector3 } from "./vector.js";
import { Triangle } from "./geometry.js";


// remove for const i in res
const PARSE_MESH_DATA = (data, ...extracts) => {
    const res = {};
    extracts.forEach((key, i) => res[key] = []);
    let spliitedData = data.split("\n");
    for(const i in res) {
        spliitedData.forEach((item, j) => {
            if(item.startsWith(i)) {
                let value = item.split(" ");
                res[i].push([value[1], value[2], value[3]]
                    .map(i => parseFloat(i)));
            };
        });
    };

    return res;
};


/**
 * 
 * Class representing a mesh: containing many triangles. This function 
 * may take an update function
 * @class
 * 
*/
export class Mesh {

    /**
     * parse waveFront obj or obj like data format
     * @static
     * @param {string} data - obj file format representing mesh data
     * @param  {...any} extracts - keys in the obj file
     * @returns {Object}
     */
    static parseWaveFront(data, ...extracts) {
        return PARSE_MESH_DATA(data, ...extracts);
    }

    /**
     * construct a mesh. The constructor expects the data to have 3 constants keyword 
     * for it's modelling [ v, f, c].
     * v - vertices
     * f - faces
     * c - face color
     * a valid data could be
     * `
     * v 0 0 0
     * v 0 1 .
     * v ....
     * f 1 2 3
     * f 3 1 2
     * c 90 50 50` hsl
     * @constructor
     * @param {string} data - obj file format representing mesh data
     */
    constructor(data) {

        this.data = Mesh.parseWaveFront(data, "v", "f", "c");

        this.vertices = this.data.v || [];
        this.faces = this.data.f || [];
        this.faceColor = this.data.c || [];
        this.triangles = [];
        this.scale = new Vector3(1, 1, 1);
        this.position = new Vector3();
        this.rotation = new Vector3();

        this.showVertex = false;
        this.showWireFrame = true;
        this.fillShader = true;
        this.wireFrameColor = undefined;

        this.updateGeometry();
    }

    /**
     * Always call this function after every vertices, faces and faceColor has been updated
     */
    updateGeometry() {
        this.faces.forEach((face, i) => {
            let length = face.length;
            let v = this.vertices;
            let c = this.faceColor[i];
            let triangle = new Triangle([
                v[face[0] - 1], 
                v[face[1] - 1],
                v[face[2] - 1]
            ], {});
            triangle.vertices.forEach((v, i) => {
            });
            triangle.color.h = c[0];
            triangle.color.s = c[1];
            triangle.color.l = c[2];
            triangle.color.a = c[3] || 1;
            this.triangles[i] = triangle;
        });
    }

    /**
     * Set mesh position
     * @param {number} x - position on the x-axis
     * @param {number} y - position on the y-axis
     * @param {number} z - position on the z-axis
     */
    setPosition(x = 0, y = 0, z = 0) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }

    /**
     * Set mesh rotation
     * @param {number} x - rotation on the x-axis
     * @param {number} y - rotation on the y-axis
     * @param {number} z - rotation on the z-axis
     */
    setRotation(x = 0, y = 0, z = 0) {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
    }

    /**
     * Set mesh scale
     * @param {number} x - scale on the x-axis
     * @param {number} y - scale on the y-axis
     * @param {number} z - scale on the z-axis
     */
    setScale(x = 1, y = 1, z = 1) {
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
    }

    /**
     * @private
     * @param {Scene} scene - The scene
     */
    process(scene) {

        if(typeof this.update === "function")
            this.update();

        // There's no rotation about the y-axis
        let mRotateX = Mat4x4.pitchRotation(this.rotation.x + scene.camera.rotation.x);
        let mRotateZ = Mat4x4.rollRotation(this.rotation.z + scene.camera.rotation.z);
        let mRotate = Mat4x4.multiplyMatrix(mRotateX, mRotateZ);

        this.triangles.forEach(tri => {

            let transformed = [];
            let projected = [];

            tri.vertices.forEach((vertex, i) => {
                // scale
                transformed[i] = vertex.mult(this.scale);
                // translate
                transformed[i] = transformed[i].add(this.position);
                // rotate
                transformed[i] = Mat4x4.multiplyVector(mRotate, transformed[i]);
            });

            // get normal
            let line1 = transformed[0];
            let line2 = transformed[1].sub(line1);
            let line3 = transformed[2].sub(line1);
            let cross = line2.cross(line3);
            cross.normalise();
           
            /**
             * front face polygon have -z and positive dot
             * backface polygon have +z and negative dot
             */
            if(cross.z < 0) {

                let zAverage = (transformed[0].z + transformed[1].z + transformed[2].z) / 3;
                // let light = new Vector3(100, 0, -150).sub(line1);
                // light.normalise();
                let alpha = 1; //light.dot(cross);

                transformed.forEach((tri, i) => {

                    projected[i] = Mat4x4.multiplyVector(scene.projectionMatrix, tri);

                    // scale to view space
                    projected[i].x += 1;
                    projected[i].y += 1;
                    projected[i].x *= scene.width * 0.5;
                    projected[i].y *= scene.height * 0.5;

                });     // END PROJECTION

                scene.toRaster.push({
                    vertices: projected,
                    zAverage,
                    alpha,
                    color: tri.color,
                    showVertex: this.showVertex,
                    showWireFrame: this.showWireFrame,
                    fillShader: this.fillShader,
                    wireFrameColor: this.wireFrameColor
                });

            }   

        });     // END MAIN TRIANGLE LOOP

    }

};