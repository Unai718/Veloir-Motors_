const T = Motor3D;
const { GLTFLoader, RoomEnvironment } = T;
const steps = [
  [
    "Selección",
    "¿Qué coche buscas?",
    "Cuéntanos qué modelo tienes en mente, qué equipamiento necesitas y cuánto quieres gastar. Buscamos en el mercado europeo y te explicamos por qué merece la pena ver cada unidad.",
  ],
  [
    "Presupuesto",
    "¿Cuánto cuesta traerlo?",
    "Con la unidad elegida, te enviamos una estimación del coste total en España. Verás cuánto corresponde al coche, cuánto cuesta traerlo y cuánto cobramos por el servicio.",
    [
      "Precio del vehículo",
      "Peritaje, viaje y traslado",
      "Trámites y tasas estimados en España",
      "Honorarios de Veloir Motors",
    ],
  ],
  [
    "Peritaje en origen",
    "Primero, una mirada sobre el terreno",
    "Antes de reservar el vuelo, una empresa de peritaje de la zona revisa el coche. Compartimos contigo sus observaciones y fotos para que puedas valorar si merece la pena viajar.",
  ],
  [
    "Viaje",
    "Tú das el visto bueno al viaje",
    "Si el peritaje y el presupuesto te encajan, concertamos la visita con el vendedor. Nos desplazamos para comprobar en persona que el coche coincide con la unidad que has elegido.",
  ],
  [
    "Inspección · Ruedas",
    "Lo que cuentan las ruedas",
    "Revisamos si las llantas tienen golpes o roces y si los neumáticos muestran un desgaste desigual. Te enseñamos los detalles que puedan influir en la compra.",
  ],
  [
    "Inspección · Cristales",
    "Una mirada a contraluz",
    "Observamos el parabrisas y las ventanillas desde varios ángulos. Si vemos un impacto o una fisura, te mostramos dónde está y qué tamaño tiene.",
  ],
  [
    "Inspección · Carrocería",
    "La pintura, panel a panel",
    "Seguimos el reflejo de la luz sobre capó, puertas y aletas para apreciar arañazos, abolladuras o diferencias de tono. Contrastamos lo que vemos con las fotos del peritaje.",
  ],
  [
    "Inspección · Habitáculo",
    "Desde el asiento del conductor",
    "Al abrir la puerta, comprobamos el desgaste del asiento y del volante y probamos los mandos principales. Si encontramos algo que el informe no recogía, te lo contamos antes de seguir.",
  ],
  [
    "Documentación · Estado",
    "El informe, con la visita en contexto",
    "Repasamos contigo el informe del perito junto con las fotos de nuestra visita. Así puedes valorar el estado de esta unidad y decidir si quieres cerrar la compra.",
    [],
    [
      "Informe de peritaje",
      "Unidad y número de bastidor",
      "Observaciones del perito",
      "Fotografías de la inspección",
    ],
  ],
  [
    "Documentación · Compra",
    "Lo acordado, por escrito",
    "Antes de firmar, repasamos contigo el contrato: quién vende, qué vehículo compras, a qué precio y en qué condiciones se entrega. Recibes una copia para tu expediente.",
    [],
    [
      "Contrato de compraventa",
      "Datos de comprador y vendedor",
      "Vehículo y número de bastidor",
      "Precio y condiciones de entrega",
    ],
  ],
  [
    "Documentación · Gastos",
    "Del presupuesto al coste final",
    "Reunimos los justificantes de los trámites y tasas que correspondan en España. Comparamos cada importe con la estimación inicial y te explicamos cualquier diferencia.",
    [],
    [
      "Justificantes de pago",
      "Trámite realizado",
      "Importe abonado",
      "Referencia del justificante",
    ],
  ],
  [
    "Entrega",
    "Tu coche y tus llaves",
    "Acordamos la entrega y repasamos el vehículo contigo, por dentro y por fuera. Te llevas las llaves, la documentación de la compra y el desglose final de lo que has pagado.",
  ],
];
const $ = (s) => document.querySelector(s),
  stage = $("#stage"),
  status = $("#status");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let current = -2;
const portada = [
  "",
  "Tu próximo coche está en Europa.",
  "Nosotros vamos a verlo por ti.",
];
const markers = {
  4: {
    name: "Borde de la llanta",
    point: [0.61, 0.32, 1.16],
    note: "Aquí buscamos marcas de bordillo y golpes en el borde exterior.",
  },
  5: {
    name: "Parabrisas",
    point: [0.18, 0.79, 0.48],
    note: "Observamos el cristal a contraluz: un impacto pequeño puede pasar desapercibido de frente.",
  },
  7: {
    name: "Volante",
    point: [0.24, 0.6, 0.41],
    note: "Revisamos el desgaste del aro y probamos los mandos desde el asiento del conductor.",
  },
};
const spot = $("#spot"),
  note = $("#spot-note");
function closeMarker() {
  spot.setAttribute("aria-expanded", "false");
  note.hidden = true;
  spot.textContent = "+";
}
spot.onclick = (e) => {
  e.stopPropagation();
  const open = note.hidden;
  note.hidden = !open;
  spot.setAttribute("aria-expanded", String(open));
  spot.textContent = open ? "−" : "+";
};
spot.onkeydown = (e) => {
  if (e.key === "Escape") closeMarker();
};
$("#begin").onclick = () => move(0);
const chapters = [...document.querySelectorAll("#chapters button")];
chapters.forEach((b) => (b.onclick = () => move(Number(b.dataset.step))));
function progress() {
  return Math.max(
    -1,
    Math.min(
      steps.length - 1,
      (scrollY / (document.documentElement.scrollHeight - innerHeight)) *
        steps.length -
        1,
    ),
  );
}
function move(i) {
  scrollTo({
    top:
      ((document.documentElement.scrollHeight - innerHeight) * (i + 1)) /
      steps.length,
    behavior: reduced ? "instant" : "smooth",
  });
}
$("#prev").onclick = () => move(Math.max(-1, current - 1));
$("#next").onclick = () =>
  move(current === steps.length - 1 ? -1 : current + 1);

function updateCopy() {
  const p = progress(),
    i = Math.round(p);

  $("#progress").style.width = (100 * (p + 1)) / steps.length + "%";

  if (i === current) return;

  current = i;

  const intro = i === -1;

  document.querySelector("article").classList.toggle("intro", intro);
  $("#begin").hidden = !intro;
  $("#contact").hidden = i !== steps.length - 1;
  $("#prev").parentElement.hidden = intro;
  $("#label").hidden = intro;

  let active = null;

  for (const b of chapters) {
    if (i >= Number(b.dataset.step)) active = b;
  }

  chapters.forEach((b) => {
    if (b === active) b.setAttribute("aria-current", "step");
    else b.removeAttribute("aria-current");
  });

  closeMarker();
  spot.hidden = true;

  const [label, title, body, items = [], doc] = intro ? portada : steps[i];

  $("#label").textContent = label;
  $("h1").textContent = title;
  $("#body").textContent = body;

  $("#details").replaceChildren(
    ...items.map((x) =>
      Object.assign(document.createElement("li"), { textContent: x }),
    ),
  );

  $("#prev").disabled = intro;

  $("#next").textContent =
    i === steps.length - 1 ? "Volver al inicio ↑" : "Siguiente →";

  $(".sheet").hidden = !doc;

  if (doc) {
    $(".sheet h2").textContent = doc[0];

    $(".sheet div").replaceChildren(
      ...doc
        .slice(1)
        .map((x) =>
          Object.assign(document.createElement("p"), { textContent: x }),
        ),
    );
  }

  // ANIMACIÓN DE DESLIZAMIENTO
  const texto = document.querySelector(".copy");

  texto.classList.remove("animar");

  // Reinicia la animación para cada etapa
  void texto.offsetWidth;

  texto.classList.add("animar");
}

updateCopy();
addEventListener("scroll", updateCopy, { passive: true });
addEventListener("resize", updateCopy);
async function start() {
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  stage.appendChild(renderer.domElement);
  const scene = new T.Scene(),
    camera = new T.PerspectiveCamera(33, 1, 0.018, 100);
  const pm = new T.PMREMGenerator(renderer),
    room = new RoomEnvironment(),
    env = pm.fromScene(room, 0.04);
  scene.environment = env.texture;
  pm.dispose();
  room.dispose();
  scene.add(new T.HemisphereLight(0xf4f5ff, 0x767b70, 1.4));
  const light = new T.DirectionalLight(0xfff1dd, 2.1);
  light.position.set(4, 6, 3);
  scene.add(light);
  const { scene: car } = await cargarVehiculo();
  scene.add(car);
  const door = car.getObjectByName("Front_Left_Door"),
    trunk = car.getObjectByName("Trunk");
  if (!door || !trunk) throw Error("No se encontraron las piezas móviles.");
  const doorBase = door.quaternion.clone(),
    trunkBase = trunk.quaternion.clone(),
    up = new T.Vector3(0, 1, 0),
    right = new T.Vector3(1, 0, 0);
  const deliveryDoors = [
    ["Front_Right_Door", 1.012],
    ["Rear_Left_Door", -1.05],
    ["Rear_Right_Door", 1.05],
  ].map(([name, angle]) => {
    const object = car.getObjectByName(name);
    if (!object) throw new Error("Falta la puerta " + name);
    return { object, angle, closed: object.quaternion.clone() };
  });
  const ray = new T.Raycaster();
  let inspectTrunk = false,
    lastStep = progress();
  stage.onclick = (e) => {
    const bounds = stage.getBoundingClientRect();
    ray.setFromCamera(
      {
        x: (2 * (e.clientX - bounds.left)) / bounds.width - 1,
        y: 1 - (2 * (e.clientY - bounds.top)) / bounds.height,
      },
      camera,
    );
    let picked = ray.intersectObject(car, true)[0]?.object;
    if (inspectTrunk) {
      inspectTrunk = false;
      draw();
      return;
    }
    while (picked) {
      if (picked === door) {
        move(current === 7 ? 6 : 7);
        return;
      }
      if (picked === trunk) {
        inspectTrunk = true;
        draw();
        return;
      }
      picked = picked.parent;
    }
  };
  const resize = () => {
    camera.aspect = stage.clientWidth / stage.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
  };
  new ResizeObserver(resize).observe(stage);
  resize();
  // Por paso: ángulo, distancia, altura, punto de mira (x, y, z), puerta y portón.
  const keys = [
    [-1, 0.74, 4.48, 1.16, 0, 0.46, 0.06, 0, 0],
    [0, 0.82, 4.6, 1.6, 0, 0.44, 0, 0, 0],
    [1, 1.36, 4.7, 1.55, 0, 0.43, 0, 0, 0],
    [1.4, 2.52, 4.25, 1.48, 0, 0.54, -0.3, 0, 0.28],
    [2, 2.91, 3.8, 1.62, 0, 0.71, -0.54, 0, 1],
    [3, 1.66, 4.55, 1.62, 0, 0.45, 0, 0, 0],
    [4, 1.38, 1.34, 0.39, 0.54, 0.25, 1.07, 0, 0],
    [5, 0.43, 1.8, 1.4, 0.09, 0.78, 0.49, 0, 0],
    [6, 1.76, 2.22, 0.86, 0.5, 0.47, 0.02, 0, 0],
    [6.65, 2.08, 1.72, 0.94, 0.3, 0.58, 0.14, 1, 0],
    [7, 2.29, 0.85, 0.81, 0.16, 0.6, 0.39, 1, 0],
    [7.52, 2.6, 4.75, 1.7, 0, 0.68, -0.45, 0, 1],
    [8, 2.65, 4.9, 1.7, 0, 0.68, -0.45, 0, 1],
    [9, 2.7, 4.9, 1.7, 0, 0.68, -0.45, 0, 1],
    [10, 2.75, 4.9, 1.7, 0, 0.68, -0.45, 0, 1],
    [11, 0.7, 4.6, 1.55, 0, 0.44, 0, 1, 1],
  ];
  const target = new T.Vector3(),
    rot = new T.Quaternion();
  const sheet = $(".sheet");
  const trunkOpening = new T.Vector3();
  let paperStep = -1, paperStart = 0;
  function draw() {
    const p = progress();
    let k = keys.findIndex((row, i) => i > 0 && row[0] >= p);
    if (k < 0) k = keys.length - 1;
    const a = keys[k - 1],
      b = keys[k];
    let t = (p - a[0]) / (b[0] - a[0]);
    t = t * t * (3 - 2 * t);
    const v = (i) => T.MathUtils.lerp(a[i], b[i], t);
    const radius = v(2) * Math.max(1, 1.4 / camera.aspect);
    target.set(v(4), v(5), v(6));
    camera.position.set(
      target.x + Math.sin(v(1)) * radius,
      v(3),
      target.z + Math.cos(v(1)) * radius,
    );
    camera.lookAt(target);
    door.quaternion
      .copy(doorBase)
      .premultiply(rot.setFromAxisAngle(up, -1.012 * v(7)));
    trunk.quaternion
      .copy(trunkBase)
      .premultiply(rot.setFromAxisAngle(right, 0.995 * v(8)));
    const delivery = T.MathUtils.smoothstep(p, 10, 11);
    for (const { object, angle, closed } of deliveryDoors) {
      object.quaternion
        .copy(closed)
        .premultiply(rot.setFromAxisAngle(up, angle * delivery));
    }
    if (Math.abs(p - lastStep) > 0.0001) inspectTrunk = false;
    lastStep = p;
    if (inspectTrunk) {
      trunk.quaternion
        .copy(trunkBase)
        .premultiply(rot.setFromAxisAngle(right, 0.99));
      camera.position.set(0.4, 1.75, -4.1);
      camera.lookAt(0, 0.65, -0.75);
    }
    // Deja sitio al documento a la derecha, o por encima del coche en móvil.
    const narrow = matchMedia("(max-width: 720px)").matches;
    const space = T.MathUtils.smoothstep(p,7.2,7.8)*(1-T.MathUtils.smoothstep(p,10.4,11));
    camera.updateProjectionMatrix();
    camera.projectionMatrix.elements[8] += narrow ? 0 : .35*space;
    camera.projectionMatrix.elements[9] += narrow ? .43*space : .02*space;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    camera.updateMatrixWorld();
    if (!sheet.hidden) {
      if (paperStep !== current) {paperStep = current; paperStart = performance.now();}
      const t = reduced ? 1 : Math.min(1,(performance.now()-paperStart)/850);
      const travel = t*t*(3-2*t);
      trunkOpening.set(0,.68,-1.48).project(camera);
      const width=stage.clientWidth, height=stage.clientHeight;
      const originX=(trunkOpening.x+1)*width/2, originY=(1-trunkOpening.y)*height/2;
      const endX=narrow ? width*.50 : width-sheet.offsetWidth/2-16;
      const endY=narrow ? sheet.offsetHeight/2+3 : height*.46;
      const x=T.MathUtils.lerp(originX,endX,travel);
      const y=T.MathUtils.lerp(originY,endY,travel)-Math.sin(travel*Math.PI)*height*.12;
      sheet.style.left=x+"px"; sheet.style.top=y+"px";
      sheet.style.transform="translate(-50%, -50%) rotate("+T.MathUtils.lerp(-12,1.5,travel)+"deg) scale("+T.MathUtils.lerp(.035,1,travel)+")";
      if(t<1)schedule();
    } else {paperStep=-1;}
    const marker = markers[current];
    if (marker && !inspectTrunk && Math.abs(p - current) < 0.48) {
      const point = new T.Vector3(...marker.point).project(camera);
      const x = (point.x + 1) * 50,
        y = (1 - point.y) * 50;
      spot.hidden = x < 2 || x > 98 || y < 3 || y > 97;
      spot.style.left = x + "%";
      spot.style.top = y + "%";
      spot.setAttribute("aria-label", marker.name);
      note.textContent = marker.note;
    } else {
      spot.hidden = true;
    }
    if (spot.hidden) closeMarker();
    renderer.render(scene, camera);
  }
  let frame = 0;
  function schedule() {
    if (!frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        draw();
      });
  }
  window.addEventListener("scroll", schedule, { passive: true });
  new ResizeObserver(schedule).observe(stage);
  draw();
  status.hidden = true;
}
start().catch((e) => {
  console.error(e);
  status.textContent =
    "No se pudo mostrar el coche en 3D. Abre esta demo en Chrome o Edge con la aceleración gráfica activada.";
});

async function cargarVehiculo() {
  const loader = new GLTFLoader();
  if (location.protocol !== "file:") {
    return loader.loadAsync("./vehiculo.glb");
  }
  // En una apertura por doble clic, Chrome permite scripts locales clásicos.
  await new Promise((resolve, reject) => {
    const archivo = document.createElement("script");
    archivo.src = "./vendor/modelo-local.js";
    archivo.onload = resolve;
    archivo.onerror = () => reject(new Error("Falta vendor/modelo-local.js"));
    document.head.append(archivo);
  });
  const bytes = Uint8Array.from(atob(window.vehiculoLocal), (c) =>
    c.charCodeAt(0),
  );
  delete window.vehiculoLocal;
  return loader.parseAsync(bytes.buffer, "");
}
