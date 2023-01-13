import {
    Mesh,
    BoxGeometry,
    MeshPhongMaterial,
} from "three";

import _lampBlock from "./models/LampBlock";
import _pipeBlock from "./models/PipeBlock";
import _startBlock from "./models/StartBlock";

class Matrix {
    map = [];
    matrix = [];
    blockList = [];
    blockReferList = [];

    constructor() {
        for (var i = 0; i < 11; i++) {
            this.matrix.push([]);
            for (var j = 0; j < 11; j++) {
                this.matrix[i].push(null);
            }
        }
    }
    set(x, y, value) {
        this.matrix[x + 5][y + 5] = value;

        this.blockList.push(value);
        this.blockReferList.push({ obj: value, x: x + 5, y: y + 5 });

        this.blockList = this.blockList.filter((element) => element);
        this.blockReferList = this.blockReferList.filter((element) => element.obj);

        matrixAnalize();
        return value;
    }
    get(x, y) {
        return this.matrix[x + 5][y + 5];
    }
};

export var matrix = new Matrix();

function matrixAnalize() {
    matrix.blockReferList.map((a) => {
        if ((matrix.matrix[a.x] && matrix.matrix[a.x][a.y - 1] && matrix.matrix[a.x][a.y - 1].energy)) {
            a.obj.action(true);
            a.obj.rotation.y = -Math.PI / 2
        } else if ((matrix.matrix[a.x] && matrix.matrix[a.x][a.y + 1] && matrix.matrix[a.x][a.y + 1].energy)) {
            a.obj.action(true);
            a.obj.rotation.y = Math.PI / 2
        } else if ((matrix.matrix[a.x - 1] && matrix.matrix[a.x - 1][a.y] && matrix.matrix[a.x - 1][a.y].energy)) {
            a.obj.action(true);
            a.obj.rotation.y = 0;
        } else if ((matrix.matrix[a.x + 1] && matrix.matrix[a.x + 1][a.y] && matrix.matrix[a.x + 1][a.y].energy)) {
            a.obj.action(true);
            a.obj.rotation.y = Math.PI
        } else {
            a.obj.action(false);
        }
    })
}
function _createACube(position, color, geom = [0.98, 0.98, 0.98]) {
    let geometry = new BoxGeometry(geom[0], geom[1], geom[2]);
    let material = new MeshPhongMaterial({
        color: color,
    });
    let cube = new Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    return cube;
}
function _createAPlane(position, color) {
    const geometry = new THREE.BoxGeometry(1, 0.1, 1);
    const material = new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(position.x, position.y, position.z);
    plane.receiveShadow = true;
    return plane;
}
export function createACube(scene, position, color) {
    let geometry = new BoxGeometry(0.98, 0.98, 0.98);
    let material = new MeshPhongMaterial({
        color: color,
    });
    let cube = new Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    scene.add(cube);
    return cube;
}
export function createAPlane(scene, position, color) {
    const geometry = new THREE.BoxGeometry(0.98, 0.1, 0.98);
    const material = new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(position.x, position.y, position.z)
    scene.add(plane);
    return plane;
}
export function createMap(scene) {
    for (var i = -5; i < 6; i++) {
        for (var j = -5; j < 6; j++) {
            var plate = _createAPlane({ x: i, y: 0.5, z: j }, (i + j) % 2 == 0 ? 0x909090 : 0x666666);
            matrix.map.push(plate)
            scene.add(plate);
        }
    }
    return { size: 11 }
}
export function start(scene, position, draggable = true) {
    var cube = _startBlock();
    cube.position.set(position.x, position.y, position.z);

    cube.receiveShadow = true;
    cube.castShadow = true;

    scene.add(cube);
    if (draggable) {
        matrix.set(position.x, position.z, cube)
    }
    return ({ cube, energy: 5 })
}
export function pipe(scene, position, draggable = true) {
    var cube = _pipeBlock(position);
    cube.position.set(position.x, position.y, position.z);

    cube.receiveShadow = true;
    cube.castShadow = true;

    scene.add(cube);
    if (draggable) {
        matrix.set(position.x, position.z, cube)
    }
    return ({ cube, energy: 5 })
}
export function alternator(scene, position, draggable = true) {
    var cube = _lampBlock(position, scene);
    cube.position.set(position.x, position.y, position.z);

    cube.receiveShadow = true;
    cube.castShadow = true;

    scene.add(cube);
    if (draggable) {
        matrix.set(position.x, position.z, cube)
    }
    return ({ cube, energy: 5 })
}