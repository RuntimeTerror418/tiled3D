import {Vector2, Vector3} from "./vector.js";


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
export class Mat3x3 {

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
export class Mat4x4 {

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