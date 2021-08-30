/**
 * 
 * @author RuntimeTerror418 
 * @version 0.0.1-alpha
 * @license MIT
 * 
 * MIT License
 * Copyright (c) 2021 RuntimeTerror418
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.

 */

/**
 * @abstract
 * @class 
 * Base class for Vector Object
 */
class Vector {

    /**
     * @function clone
     * @memberof Vector
     * @static
     * @param {Vector} vec - A vector's instance to clone from
     * @returns {Vector} A cloned version of vec
     * Creates a seperate clone of another vector
     */
    static clone(vec) {
        if(!(vec instanceof Vector))
            throw new Error("Cannot clone Vector from a non-Vector Object");
        let res = vec.createVector();
        for(let i of vec.components) 
            res[i] = vec[i];
        return res;
    }

    /**
     * @hideconstructor
     * @constructor
     * @param {string} type - string indicating the type of the vector
     * @param  {...any} args - other arguments 
     * creates a vector type
     */
    constructor(type, ...args) {
        if(this.constructor === Vector)
            throw new Error("Abstract Class `Vector` cannot be Instantiated");
        this.type = type;
        this.components = type == "2d" ? ["x", "y"] : ["x", "y", "z"];
        const _length = type === "2d" ? 2 : 3;
        for(let i=0; i < _length; i++) 
            this[this.components[i]] = args[i] || 0;
    }

    /**
     * @private
     * @returns {Vector} a vector of this type
     */
    createVector() {
        return this.type === "2d" ? new Vector2() : new Vector3();
    }

    /**
     * Carry out addition operation on two vectors. The returned function has
     * the same type as the vector that calls this function
     * @param {Vector} vec - Vector to be added
     * @returns {Vector} a new vector indicating the addition of other two vectors
     */
    add(vec) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] + vec[i];
        return res;
    }

    /**
     * Carry out minus operation on two vectors. The returned function has
     * the same type as the vector that calls this function
     * @param {Vector} vec - Vector to be subtracted
     * @returns {Vector} a new vector indicating the subtraction of other two vectors
     */
    sub(vec) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] - vec[i];
        return res;
    }

    /**
     * Increase or decrease the magnitude of a vector
     * @param {number} s - Amount that scales the vector
     * @returns {Vector} a scaled vector 
     */
    scale(s) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] * s;
        return res;
    }

    /**
     * Multiply a vector by a vector. There's no real mathematical
     * formula for this but it could be intuitive in our game design
     * @param {Vector} v - A vector to be multiplied by
     * @returns {Vector} a product of two vectors
     */
    mult(v) {
        let res = this.createVector();
        for(let i of this.components)
            res[i] = this[i] * v[i];
        return res;
    }
    
    /**
     * calculate the dot product of two vectors
     * @param {Vector} vec - A vector to be multiplied by
     * @returns {number} how much two vectors a projected on one another
     */
    dot(vec) {
        let sum = 0;
        for(let i of this.components)
            sum += this[i] * vec[i];
        return sum;
    }

    /**Converts a vector to a unit vector */
    normalise() {
        if(this.magnitude != 0) {
            for(let i of this.components)
                this[i] /= this.magnitude;
        }
    }

    /**
     * Converts a vector to an array
     * @returns {Array.<number>} An array having the values of each components in the vector respectively
     * plus the w component
     */
    toArray() {
        const arr = Array.from({length: this.components.length}, (v, i) => {
            return this[this.components[i]];
        });
        arr.push(this.w);
        return arr;
    }


};


/**
 * @module
 * @augments Vector
 * @see Vector 
 * A 2-dimensional homogenous vector
 */
class Vector2 extends Vector {

    /**
     * Create a 2-dimensional vector. Each components are default to zero
     * except the w-component default to 1
     * @constructor
     * @param {number} x - value for the x-component
     * @param {number} y - value for the y-component
     * @param {number} w - value for the w-component1
     */
    constructor(x=0, y=0, w=1) {
        super("2d", x, y)
        this.w = w;
    }

    /**
     * get the magnitude oof a vector
     * @returns {number} the magnitude of the vector
     */
    get magnitude() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * get the orthogonal or the normal vector. Do not mistook 
     * this method as { @link Vector#normalise }
     * @returns {Vector2} the orthogonal vector
     */
    get normal() {
        let res = this.createVector();
        res.x = -this.y;
        res.y = this.x;
        return res;
    }

    /**
     * @returns {number} the facing direction of the vector
     */
    get angle() {
        return Math.atan2(this.y, this.x);
    }

};


/**
 * @module
 * @augments Vector
 * @see Vector 
 * A 3-dimensional homogenous vector
 */
class Vector3 extends Vector {

    /**
    * Create a 3-dimensional vector. Each components are default to zero
     * except the w-component default to 1
     * @constructor
     * @param {number} x - value for the x-component
     * @param {number} y - value for the y-component
     * @param {number} z - value for the z-component
     * @param {number} w - value for the w-component
     */
    constructor(x=0, y=0, z=0, w=1) {
        super("3d", x, y, z)
        this.w = w;
    }

    /**
     * get the magnitude of a vector
     * @returns {number} the magnitude of the vector
    */
    get magnitude() {
        return Math.hypot(this.x, this.y, this.z);
    }
  
    /**
     * Calculate the cross product of two vectors. This method is good
     * in 3d graphics to get the face normal of a polygon
     * @param {Vector3} vec - A vector object
     * @returns {Vector3} a vector orthogonal to both other vectors/
     */
    cross(vec) {
        let res = this.createVector();
        res.x = this.y * vec.z - this.z * vec.y;
        res.y = this.z * vec.x - this.z * vec.z;
        res.z = this.x * vec.y - this.y * vec.x;
        return res;
    }

};




/**
 * Matrix
 * @param {number} length - size of the matrix
 * @returns {Object}
 */
const Mat = (length => {

    if(length !== 3 && length !== 4)
        throw TypeError("Only a 3x3 and 4x4 matrix supported");

    const mat = {};

    /**
     * Create a matrix
     * @param  {...any} args - values of each index in the matrix
     * @returns {Float32Array} The matrix
     */
    mat.create = (...args) => {
        const buffer = new ArrayBuffer(4 * length * length);
        const arr = new Float32Array(buffer).map((val, i) => args[i] || 0);
        return arr;
    };

    /**
     * Add a matrix to another
     * @param {Float32Array} m1 - The first matrix
     * @param {Float32Array} m2 - The second matrix
     * @returns {Float32Array}
     */
    mat.add = (m1, m2) => {
        return m1.map((val, i) => val + m2[i]);
    }

    /**
     * Subtract a matrix from another
     * @param {Float32Array} m1 - The first matrix
     * @param {Float32Array} m2 - The second matrix
     * @returns {Float32Array}
     */
    mat.sub = (m1, m2) => {
        return m1.map((val, i) => val - m2[i]);
    }

    /**
     * 
     * @param {Float32Array} m1 - The matrix
     * @param {number} s - The scaling value
     * @returns {Float32Array} - The scaled matrix
     */
    mat.multiplyScalar = (m1, s) => {
        return m1.map(val => val * s);
    }

    /**
     * A diagonal matrix has zero anywhere not on the main diagonal
     * 
     * @param  {...any} arg Value of each item in diagonal
     * @returns {Array} a diagonal matrix
     */
    mat.diagonal = (...arg) => {
        let m = mat.create();
        for(let i=0; i < length; i++) 
            m[i * length + i] = arg[i] || 0;
        return m;
    };


    /**
     * An identity matrix has zero anywhere and 1 on it's main diagonal
     * @returns {Float32Array} an identity matrix
     */
    mat.identity = () => mat.diagonal(1, 1, 1);


    /**
     * Creates a Translation matrix
     * @param  {...any} args - Values to be translated on each axis
     * @returns {Float32Array} - A translation matrix
     */
    mat.translate = (...args) => {
        let m = mat.identity();
        for(let i=0; i < length; i++) {
            for(let j=0; j < length; j++) {
                if(j + 1 == length) 
                    m[i * length + j] = args[i] || 1;
            }
        }
        return m;
    }


    /**
     * Transpose the item of a matrix
     * @param {Float32Array} m - The matrix
     * @returns {Float32Array} - The transposed Matrix
     */
    mat.transpose = m => {
        const size = m.length / length;
        const copy = mat.clone(m);
        for(let i=0; i < size; i++) {
            for(let j=0; j < size; j++) {
                m[i * length + j] = copy[j * length + i];
            }
        };
        return m;
    };


    /**
     * Rotate each piece/item in the matrix. Please do not confuse this as
     * the rotation operation which deals with directions.
     * @param {Float32Array} m - The matrix
     * @param {Float32Array} clockwise - clockwise or counter-clockwise
     * @returns {Float32Array} - A rotated matrix
     */
    mat.rotate = (m, clockwise = true) => {
        const size = m.length / length;
        const copy = mat.clone(m);
        for(let i=0; i < size; i++) {
            for(let j=0; j < size; j++) {
                let y = clockwise ? length - 1 - j : j;
                let x = clockwise ? i : length - 1 - i;
                m[i * length + j] = copy[y * length + x];
            }
        };
        return m;
    }


    /**
     * Multiply a matrix by a vector.. note that the column of the matrix must be equal to 
     * the component length of the vector including the homogenous w-component.
     * @param {Float32Array} m - An Array representing a fixed size matrix
     * @param {Vector | Vector2 | Vector3} vec - A vector 
     * @returns {Vector2 | Vector3} depends on the input size vector
     */
    mat.multiplyVector = (m, vec) => {

        if(!(vec instanceof Vector2) && !(vec instanceof Vector3))
            throw TypeError("Vector must be an instance of `Vector2` or `Vector3` when multiplying matrices by a vector");

        const column = m.length / length;
        const row = vec.components.length + 1;
        if(column != row) 
            throw TypeError("Left hand column must be equal to right hand row");
        
        let sum = 0;
        let v = vec.toArray();
        let res = [];
        for(let i=0; i < row; i++) {
            sum = 0;
            for(let j=0; j < column; j++) {
                sum += m[i * length + j] * v[j];
            };
            res[i] = sum;
        };
        v = row === 4 ? new Vector3(res[0], res[1], res[2], res[3]) 
            : new Vector2(res[0], res[1], res[2]);
        return v;
    };


    /**
     * Multiplies a matrix by another. Note that this matrix operation is not commutative
     * @param {Float32Array} m1 - The first matrix
     * @param {Float32Array} m2 - The second matrix
     * @returns {Float32Array} - The product operation of two matrices
     */
    mat.multiplyMatrix = (m1, m2) => {
        const column = m1.length / length;
        const row = m2.length / length;
        const size = column;
        if(column != row) {
            throw TypeError("Left hand column must be equal to right hand row");
        };
        const copy = mat.create();
        let sum;
        for(let i=0; i < size; i++) {
            for(let j=0; j < size; j++) {
                sum = 0;
                for(let k=0; k < size; k++) {
                    let a = m1[i * length + k];
                    let b = m2[k * length + j];
                    sum += a * b;
                };
                copy[i * length + j] = sum;
            }
        };
        return copy;
    };

    /**
     * Create a copy of a matrix
     * @param {Mat} m - A matrix to be cloned
     * @returns {Float32Array} a replica of it's argument
     */
    mat.clone = m => mat.create(...m);

    return mat;

});


/**
 * A 3x3 matrix class. Every operation in this class are access by static 
 * functions which always involve the matrix as the first argument and anything else 
 * as the other arguments
 * 
 * @class 
 * @extends Mat
 * @augments Mat
 */
class Mat3x3 {

    /**
     * Creates a rotation matrix about the z-axis
     * @param {number} a - angle value
     * @returns {Float32Array} A roll rotation matrix
     * @see Mat4x4#rollRotation
     * @see Mat4x4#pitchRotation
     * @see Mat4x4#yawRotation
     */
    static rotation(a) {
        let m = this.create();
        m[0][0] = Math.cos(a);
        m[0][1] = -Math.sin(a);
        m[1][0] = Math.sin(a);
        m[1][1] = Math.cos(a);
        m[2][2] = 1;
        return m;
    }

};


/**
 * A 4x4 matrix class. Every operation in this class are access by static 
 * functions which always involve the matrix as the first argument and anything else 
 * as the other arguments
 * 
 * @class 
 * @extends Mat
 * @augments Mat
 */
class Mat4x4 {

    /**
     * Creates a rotation matrix about the x-axis
     * @param {number} a - angle value
     * @returns {Float32Array} A pitch rotation matrix
     */
    static pitchRotation(a) {
        let m = this.create();
        m[0] = 1;
        m[5] = Math.cos(a);
        m[6] = -Math.sin(a);
        m[9] = Math.sin(a);
        m[10] = Math.cos(a);
        m[15] = 1;
        return m;
    }

    /**
     * Creates a rotation matrix about the y-axis
     * @param {number} a - angle value
     * @returns {Float32Array} A yaw rotation matrix
     */
    static yawRotation(a) {
        let m = this.create();
        m[0] = Math.cos(a);
        m[6] = -Math.sin(a);
        m[5] = 1;
        m[8] = Math.sin(a);
        m[10] = Math.cos(a);
        m[15] = 1;
        return m;
    }

    /**
     * Creates a rotation matrix about the z-axis
     * @param {number} a - angle value
     * @returns {Float32Array} A roll rotation matrix
     * @see Mat3x3#rotation
     */
    static rollRotation(a) {
        let m = this.create();
        m[0] = Math.cos(a);
        m[1] = -Math.sin(a);
        m[4] = Math.sin(a);
        m[5] = Math.cos(a);
        m[10] = 1;
        m[15] = 1;
        return m;
    }

};


Object.assign(Mat3x3, Mat(3));
Object.assign(Mat4x4, Mat(4));




/**
 * Creates a Triangle geometry with basic vertices and color
 * @class
 */
class Triangle {

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
class Mesh {

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






/**
 * Creates a scene
 * @class
* @todo implement camera position
* @todo implement viewport culling
* @todo rasterise triangle
* @todo implement light, vertex shader, pixel shader
* @todo implement zBuffer
* @todo implement texture coordinate
*/
class Scene {

    /**
     * constructs a scene
     * @constructor
     * @param {number} w - width of the scene
     * @param {number} h - height of the scene
     */
    constructor(w, h) {

        // element
        this.element = document.createElement("canvas");
        this.element.style.backgroundColor = "#000";
        this.element.style.width = w;
        this.element.style.height = h;
        this.ctx = this.element.getContext("2d");
        this.clearColor = undefined;

        // props
        this.projectionMatrix = Mat4x4.create();
        this.objects = [];
        this.toRaster = [];
        this.camera = {
            position: new Vector3(),
            rotation: new Vector3()
        };

        this.updateProjectionMatrix(0, w, h, 0, 0.1, 100);
    }

    /**
     * Clear the scene
     * @param {number} _x - starting position on the x-axis
     * @param {number} _y - starting position on the y-axis
     * @param {number} _w - width of the clearing rectangle
     * @param {number} _h - height of the clearing rectangle
     */
    clear(_x, _y, _w, _h) {
        const x = _x || 0;
        const y = _y || 0;
        const w = _w || this.width;
        const h = _h || this.height;
        if(this.clearColor) {
            this.ctx.fillStyle = this.clearColor;
            this.ctx.fillRect(x, y, w, h);
        } else 
            this.ctx.clearRect(x, y, w, h)
    }   

    /**
     * Rotates the scene: Note that rotation on the y-axis has been diabled
     * @param {number} x - rotation on the x-axis
     * @param {number} y - rotation on the y-axis
     * @param {number} z - rotation on the z-axis
     */
    setRotation(x = 0, y = 0, z = 0) {
        this.camera.rotation.x = x;
        this.camera.rotation.y = y;
        this.camera.rotation.z = z;
    }

    set width(w) {
        this.element.width = w;
    }

    set height(h) {
        this.element.height = h;
    }

    get width() {
        return this.element.width;
    }

    get height() {
        return this.element.height;
    }

    /**
     * Creates an orthographic projection matrix.
     * as described on { @link https://en.wikipedia.org/wiki/Orthographic_projection }
     * @param {number} left - leftmost boundary
     * @param {number} right - rightmost boundary
     * @param {number} bottom - bottom boundary
     * @param {number} top - top boundary
     * @param {number} near - near plane
     * @param {number} far - farthest distance
     */
    updateProjectionMatrix(left, right, bottom, top, near, far) {
        this.projectionMatrix[0] = 2 / (right - left);
        this.projectionMatrix[3] = -(right + left) / (right - left);
        this.projectionMatrix[5] = 2 / (top - bottom);
        this.projectionMatrix[7] = -(top + bottom) / (top - bottom);
        this.projectionMatrix[10] = -2 / (far - near);
        this.projectionMatrix[11] = -(far + near) / (far - near);
        this.projectionMatrix[15] = 1;
    }

    /**
     * Adds an object  to the scene for rendering and other processes
     * @param {Mesh} obj - Mesh to be added
     */
    add(obj) {
        if(!(obj instanceof Mesh))
            throw TypeError("You can only Add an instance of a `Mesh` object to the scene");
        this.objects.push(obj);
    }

    /**
     * render the scene
     */
    render() {

        this.toRaster = [];

        this.objects.forEach(obj => { obj.process(this) });
        /**
         * To raster is an array of objects containing data of triangles 
         * relative to their mesh [projected, color]
         */

        this.toRaster.sort((a, b) => a.zAverage < b.zAverage);

         let ctx = this.ctx;
         this.toRaster.forEach((tri, i) => {

            let saturation = 50;
            let light = Math.max(20, tri[3] * 50);
            let v = tri.vertices;
            let c = tri.color;

            // show polygon vertex
            if(tri.showVertex) {
                ctx.save();
                v.forEach((vertex, i) => {
                    ctx.fillStyle = c;
                    ctx.beginPath();
                    ctx.arc(vertex.x, vertex.y, 2, 0, 2*Math.PI);
                    ctx.closePath();
                    ctx.fill();
                });
                ctx.restore();
            };
            
            if(tri.showWireFrame || tri.fillShader) {
                ctx.strokeStyle = tri.wireFrameColor ? tri.wireFrameColor : `hsla(${c.h}, ${c.s}%, ${c.l}%, ${c.a})`;
                ctx.fillStyle = `hsla(${c.h}, ${c.s}%, ${c.l}%, ${c.a})`;
                ctx.beginPath();
                ctx.moveTo(v[0].x, v[0].y);
                ctx.lineTo(v[1].x, v[1].y);
                ctx.lineTo(v[2].x, v[2].y);
                ctx.closePath();
                if(tri.fillShader) ctx.fill();
                ctx.stroke();
            };


         });    // END TO RASTER

        this.toRaster = [];

    }

};