import { Mat4x4 } from "./matrices.js";
import { Vector3 } from "./vector.js";
import { Mesh } from "./mesh.js";


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
export class Scene {

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