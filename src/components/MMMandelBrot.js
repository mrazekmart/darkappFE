import React, {useContext, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import shader from 'glslify';
import {ZIndexContext} from "../ZIndexContext";

const MMMandelBrot = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const { setZIndex } = useContext(ZIndexContext);

    const navigateToUrl = () => {
        setZIndex(-1);
        navigate("/");
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                navigateToUrl();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl2');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw();
        };
        window.addEventListener('resize', resizeCanvas);

        const vertexShader = `#version 300 es
          in vec2 position;
          void main() {
            gl_Position = vec4(position, 0, 1);
          }
        `;

        const fragmentShader = shader(`#version 300 es
          precision mediump float;
          uniform vec2 resolution;
          uniform float zoom;
          uniform vec2 center;
          out vec4 fragColor;
        
          vec2 complexMul(vec2 a, vec2 b) {
            return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
          }
        
          void main() {
            vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / zoom + center;
        
            vec2 z = vec2(0.0);
            vec2 c = uv;
        
            for (int i = 0; i < 1000; ++i) {
              if (length(z) > 400.0) {
                float color = float(i) / 100.0;
                fragColor = vec4(vec3(0.2, 0.1, color), 1.0);
                return;
              }
              z = complexMul(z, z) + c;
            }
        
            fragColor = vec4(0.4, 0.8, 0.4, 1.0);
          }
        `);

        const program = createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, 'position');
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        let zoom = 35000;
        let center = [-0.7020262791510383, 0.36030954333341126];
        ;

        const draw = () => {
            const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
            const zoomUniformLocation = gl.getUniformLocation(program, 'zoom');
            const centerUniformLocation = gl.getUniformLocation(program, 'center');

            gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
            gl.uniform1f(zoomUniformLocation, zoom);
            gl.uniform2f(centerUniformLocation, center[0], center[1]);

            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        const handleWheel = (event) => {
            event.preventDefault();
            zoom *= 1.0 - event.deltaY * 0.001;
            console.log(zoom);
            console.log(center);
            draw();
        };

        let isDragging = false;
        let prevMousePos = {x: 0, y: 0};

        const handleMouseDown = (event) => {
            isDragging = true;
            prevMousePos.x = event.clientX;
            prevMousePos.y = event.clientY;
        };

        const handleMouseMove = (event) => {
            if (!isDragging) {
                return;
            }

            const dx = (event.clientX - prevMousePos.x) / zoom;
            const dy = (event.clientY - prevMousePos.y) / zoom;

            center[0] -= dx;
            center[1] += dy;

            prevMousePos.x = event.clientX;
            prevMousePos.y = event.clientY;

            draw();
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('wheel', handleWheel, {passive: false});

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);

            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }}/>
        </div>
    );
};

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    checkShaderCompilation(gl, vertexShader, 'VERTEX_SHADER');

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    checkShaderCompilation(gl, fragmentShader, 'FRAGMENT_SHADER');

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    return program;
}

function checkShaderCompilation(gl, shader, type) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`ERROR compiling ${type}!`, gl.getShaderInfoLog(shader));
        return;
    }
}

export default MMMandelBrot;