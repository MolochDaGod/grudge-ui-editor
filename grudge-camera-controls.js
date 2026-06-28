/**
 * Gamepad + keyboard camera for 3D asset browser (OrbitControls).
 */
(function (global) {
  const DEADZONE = 0.18;

  function applyDeadzone(v) {
    return Math.abs(v) < DEADZONE ? 0 : v;
  }

  function attachGrudgeCamera(opts) {
    const {
      camera,
      controls,
      domElement,
      sceneId = 'assets',
      statusEl,
    } = opts;

    let padIndex = null;
    let flyKeys = Object.create(null);
    const speed = { orbit: 1.4, zoom: 2.5, pan: 1.2 };

    function setStatus(msg) {
      if (statusEl) statusEl.textContent = msg;
    }

    function capturePose() {
      return {
        position: camera.position.toArray(),
        target: controls.target.toArray(),
        mode: controls.enablePan ? 'orbit' : 'orbit',
      };
    }

    async function restorePose() {
      if (!global.GrudgeCloud?.loadCameraState) return;
      const pose = await GrudgeCloud.loadCameraState(sceneId);
      if (!pose?.position) return;
      camera.position.fromArray(pose.position);
      if (pose.target) controls.target.fromArray(pose.target);
      controls.update();
    }

    let saveTimer = null;
    function scheduleSave() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        global.GrudgeCloud?.saveCameraState?.(sceneId, capturePose());
      }, 800);
    }

    controls.addEventListener('change', scheduleSave);

    function onKeyDown(e) {
      flyKeys[e.code] = true;
      if (e.code === 'KeyF' && !e.ctrlKey && !e.metaKey) {
        const locked = domElement.requestPointerLock?.();
        if (locked !== undefined) setStatus('FPS look — Esc to exit');
      }
      if (e.code === 'Digit1') applyPreset('orbit');
      if (e.code === 'Digit2') applyPreset('front');
      if (e.code === 'Digit3') applyPreset('top');
    }

    function onKeyUp(e) {
      flyKeys[e.code] = false;
    }

    function applyPreset(name) {
      const t = controls.target;
      if (name === 'front') {
        camera.position.set(t.x, t.y + 1, t.z + 6);
      } else if (name === 'top') {
        camera.position.set(t.x, t.y + 12, t.z + 0.01);
      } else {
        camera.position.set(t.x + 5, t.y + 4, t.z + 7);
      }
      camera.lookAt(t);
      controls.update();
      scheduleSave();
      setStatus('Camera: ' + name);
    }

    function orbitBy(dt, lx, ly) {
      const rotL = controls._rotateLeft || controls.rotateLeft;
      const rotU = controls._rotateUp || controls.rotateUp;
      if (!rotL && !rotU) return false;
      if (lx && rotL) rotL.call(controls, (lx * speed.orbit * dt) / 60);
      if (ly && rotU) rotU.call(controls, (ly * speed.orbit * dt) / 60);
      return !!(lx || ly);
    }

    function zoomBy(dt, amount) {
      if (!amount) return false;
      const getScale = controls._getZoomScale || controls.getZoomScale;
      const dIn = controls._dollyIn || controls.dollyIn;
      const dOut = controls._dollyOut || controls.dollyOut;
      const scale = getScale
        ? getScale.call(controls, amount * speed.zoom * dt)
        : Math.pow(0.95, -amount * speed.zoom * dt * 0.15);
      if (amount > 0 && dIn) dIn.call(controls, scale);
      else if (amount < 0 && dOut) dOut.call(controls, 1 / scale);
      else return false;
      return true;
    }

    function pollGamepad(dt) {
      const pads = navigator.getGamepads?.() || [];
      if (padIndex === null) {
        padIndex = pads.findIndex((p) => p?.connected);
        if (padIndex >= 0) setStatus('Gamepad ' + (padIndex + 1) + ' — L orbit · R zoom');
      }
      const gp = padIndex >= 0 ? pads[padIndex] : null;
      if (!gp) return false;

      const lx = applyDeadzone(gp.axes[0] || 0);
      const ly = applyDeadzone(gp.axes[1] || 0);
      const rx = applyDeadzone(gp.axes[2] || 0);
      const rt = gp.buttons[7]?.value ?? (gp.buttons[7]?.pressed ? 1 : 0);
      const lt = gp.buttons[6]?.value ?? (gp.buttons[6]?.pressed ? 1 : 0);

      let moved = orbitBy(dt, lx, ly);
      moved = zoomBy(dt, rt - lt) || moved;
      if (rx) {
        controls.target.x += rx * speed.pan * dt * 0.04;
        moved = true;
      }

      if (gp.buttons[0]?.pressed) applyPreset('orbit');
      if (gp.buttons[1]?.pressed) scheduleSave();
      return moved;
    }

    function keyboardFly(dt) {
      const move = speed.pan * dt * 0.08;
      let moved = false;
      if (flyKeys.KeyW || flyKeys.ArrowUp) { controls.target.z -= move; moved = true; }
      if (flyKeys.KeyS || flyKeys.ArrowDown) { controls.target.z += move; moved = true; }
      if (flyKeys.KeyA || flyKeys.ArrowLeft) { controls.target.x -= move; moved = true; }
      if (flyKeys.KeyD || flyKeys.ArrowRight) { controls.target.x += move; moved = true; }
      if (flyKeys.KeyQ) { controls.target.y -= move; moved = true; }
      if (flyKeys.KeyE) { controls.target.y += move; moved = true; }
      return moved;
    }

    let last = performance.now();
    function tick(now) {
      const dt = Math.min(32, now - last);
      last = now;
      const moved = pollGamepad(dt) || keyboardFly(dt);
      if (moved) controls.update();
      requestAnimationFrame(tick);
    }

    global.addEventListener('keydown', onKeyDown);
    global.addEventListener('keyup', onKeyUp);
    global.addEventListener('gamepadconnected', () => {
      padIndex = null;
    });
    requestAnimationFrame(tick);

    restorePose();

    return {
      applyPreset,
      capturePose,
      restorePose,
      dispose() {
        global.removeEventListener('keydown', onKeyDown);
        global.removeEventListener('keyup', onKeyUp);
      },
    };
  }

  global.GrudgeCamera = { attach: attachGrudgeCamera };
})(typeof window !== 'undefined' ? window : globalThis);