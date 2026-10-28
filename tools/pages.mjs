/*
 * Content of the solution pages (one URL per language each). tools/build.mjs
 * turns these into static HTML; there is no JavaScript translation on them.
 * The URLs themselves are set in js/config.js (SITE_CONFIG.pages).
 *
 * Plain text only (no HTML). Only state what the product really does.
 *
 * Section types:
 *   { h2, lead?, paras?: [...] }
 *   { h2, lead?, tiles: [[title, text], ...] }      grid of cards
 *   { h2, lead?, steps: [[title, text], ...] }      numbered steps
 *   { h2, lead?, cols: [{ h3, items: [...] }, ...] } two lists side by side
 *   { h2, lead?, table: { head: [...], rows: [[...], ...] } }
 *   { figure: true }                                the bent-pin example
 */

const ui = {
  en: {
    home: "Home",
    breadcrumb: "Breadcrumb",
    faq: "Questions",
    related: "More applications",
    figPhoto: "Photo of the board",
    figHeat: "Heat map from VisionInspect",
    figCaption: "A bent pin on a sensor board, found by a model trained on a single good board. The heat map marks where the board differs from the good one.",
    credit: "Image",
    learnMore: "Learn more",
    navPcb: "PCB inspection",
    navAssembly: "Assembly monitoring",
    navAnomaly: "Without defect images",
  },
  de: {
    home: "Startseite",
    breadcrumb: "Brotkrumen-Navigation",
    faq: "Häufige Fragen",
    related: "Weitere Anwendungen",
    figPhoto: "Foto der Platine",
    figHeat: "Heatmap von VisionInspect",
    figCaption: "Ein verbogener Pin auf einer Sensorplatine, gefunden von einem Modell, das mit nur einer Gutplatine angelernt wurde. Die Heatmap zeigt, wo die Platine von der guten abweicht.",
    credit: "Bild",
    learnMore: "Mehr erfahren",
    navPcb: "Leiterplattenprüfung",
    navAssembly: "Montageüberwachung",
    navAnomaly: "Ohne Fehlerbilder",
  },
};

const integrationsEn = [
  ["Modbus TCP", "Talk to your PLC directly, for example pulse a coil on FAIL."],
  ["MQTT", "Publish every result to your broker."],
  ["Webhooks", "Signed HTTP calls to your MES or other systems."],
  ["GPIO edge agent", "Switch lamps and relays, for example on a Raspberry Pi."],
  ["CSV / ZIP export", "Results, cycle logs and images for your records."],
  ["Any camera", "IP cameras via RTSP, USB cameras, a webcam, or a watched folder."],
];
const integrationsDe = [
  ["Modbus TCP", "Direkt mit Ihrer SPS sprechen, z. B. bei n.i.O. eine Spule schalten."],
  ["MQTT", "Jedes Ergebnis an Ihren Broker senden."],
  ["Webhooks", "Signierte HTTP-Aufrufe an Ihr MES oder andere Systeme."],
  ["GPIO-Edge-Agent", "Signallampen und Relais schalten, z. B. über einen Raspberry Pi."],
  ["CSV-/ZIP-Export", "Ergebnisse, Zyklusprotokolle und Bilder für Ihre Dokumentation."],
  ["Jede Kamera", "IP-Kameras per RTSP, USB-Kameras, eine Webcam oder ein überwachter Ordner."],
];

const pages = [
  // ---------------------------------------------------------------- PCB
  {
    key: "pcb",
    icon: "i-chip",
    en: {
      title: "AI PCB & Electronics Inspection Software | VisionInspect",
      description: "AI inspection for PCBs and electronic assemblies, trained on good boards only. Finds missing, extra and bent components, solder defects and contamination.",
      crumb: "PCB inspection",
      eyebrow: "PCB and electronics inspection",
      h1: "AI PCB inspection, trained on good boards only",
      lead: "VisionInspect checks printed circuit boards and electronic assemblies against what a good board looks like. It flags missing, extra and bent components, solder defects, flux residue and contamination, without a single image of a defect.",
      facts: ["No defect images needed", "Second check after AOI", "Runs offline on your own PC", "PLC connection via Modbus TCP"],
      teaser: "Missing, extra and bent components, solder defects and contamination on PCBs, trained on good boards only.",
      sections: [
        { figure: true },
        {
          h2: "Why PCB inspection is hard to automate",
          paras: [
            "Rule-based optical inspection has to be programmed for every board and every defect type, and it often raises false calls that someone then checks again by eye. AI tools that learn defect classes need many labelled images of every defect, which you rarely have, and never for a new product.",
            "VisionInspect takes a different route. It learns what a good board looks like and flags anything that differs. Defects that are rare, new or unexpected are flagged too, simply because they don’t look like a good board.",
          ],
        },
        {
          h2: "What it finds on a board",
          tiles: [
            ["Missing components", "A component that should be there isn’t."],
            ["Extra components", "Parts that shouldn’t be there, including loose parts lying on the board."],
            ["Bent components and pins", "Pins and components bent out of line."],
            ["Solder defects", "Solder joints that look different from those on a good board."],
            ["Flux residue and contamination", "Residue, dust, fingerprints and other contamination."],
            ["Print errors", "Smudged or missing labels and markings."],
          ],
        },
        {
          h2: "How it works",
          steps: [
            ["Show it good boards", "Take a reference photo, mark the area to inspect and add photos of good boards. Images of defects are optional."],
            ["Build the model", "One click. Every photo is aligned to the reference automatically, and the model learns what a good board looks like."],
            ["Test and set the limit", "Run test images, check the heat maps and set one pass/fail limit."],
            ["Inspect live or in batch", "Connect a camera or a folder. Every board gets a heat map, a score and PASS or FAIL, shown next to the closest good board."],
          ],
        },
        {
          h2: "A second check after AOI",
          paras: [
            "If you already run automated optical inspection (AOI), VisionInspect can look at the boards a second time, using the images your AOI system saves or its own camera. Point it at the folder your AOI writes to, and every new image is inspected as it arrives.",
          ],
        },
        { h2: "Fits into your line", tiles: integrationsEn },
        {
          h2: "Your boards stay in your plant",
          paras: [
            "VisionInspect runs on a PC or server in your own network and works fully offline; air-gapped installations are supported. Nothing leaves your network unless you switch on the optional AI second opinion.",
            "You need a PC with an NVIDIA GPU. We develop and test on a laptop with an NVIDIA RTX GPU with 4 GB of GPU memory; more GPU memory is recommended.",
          ],
        },
      ],
      faq: [
        ["How many good boards do I need?", "As few as one, if your boards look the same every time: the bent pin on this page was found by a model trained on a single good board. If your good boards vary more, add more good samples and check the result with the Test step."],
        ["Can it work alongside our AOI?", "Yes. It can inspect the images your AOI system saves, or use its own camera. The best way to see what it adds on your line is a 1-week trial on your own boards."],
        ["Do I need AI or machine vision know-how?", "No. A guided wizard takes you from the first photo to live inspection. There are no model settings to tune, only one pass/fail limit."],
        ["What if a good board is flagged?", "Add it as a good sample, or mark the result as “this was actually OK”, and the model takes it into account. With zones you can leave out areas that change from board to board."],
        ["Which cameras can I use?", "IP cameras via RTSP, USB cameras, a webcam in the browser, or any device that saves images to a folder VisionInspect watches."],
      ],
      cta: {
        h2: "Test it on your own boards",
        text: "Send us a few photos of good boards, and of defects if you have them. We’ll get back to you to arrange a demo or a 1-week trial on your own parts.",
      },
    },
    de: {
      title: "KI-Leiterplattenprüfung & Baugruppenprüfung | VisionInspect",
      description: "KI-Prüfung für Leiterplatten und Elektronikbaugruppen, nur mit Gutteilen angelernt. Erkennt fehlende, zusätzliche und verbogene Bauteile, Lötfehler und Verschmutzung.",
      crumb: "Leiterplattenprüfung",
      eyebrow: "Leiterplatten- und Elektronikprüfung",
      h1: "KI-Leiterplattenprüfung, angelernt nur mit Gutplatinen",
      lead: "VisionInspect prüft Leiterplatten und Elektronikbaugruppen gegen das Bild einer guten Platine. Fehlende, zusätzliche und verbogene Bauteile, Lötfehler, Flussmittelreste und Verschmutzung werden markiert, ohne ein einziges Fehlerbild.",
      facts: ["Keine Fehlerbilder nötig", "Zweite Prüfung nach der AOI", "Läuft offline auf Ihrem eigenen PC", "SPS-Anbindung über Modbus TCP"],
      teaser: "Fehlende, zusätzliche und verbogene Bauteile, Lötfehler und Verschmutzung auf Leiterplatten, nur mit Gutplatinen angelernt.",
      sections: [
        { figure: true },
        {
          h2: "Warum sich die Leiterplattenprüfung schwer automatisieren lässt",
          paras: [
            "Regelbasierte optische Prüfung muss für jede Platine und jede Fehlerart programmiert werden und erzeugt oft Pseudofehler, die dann doch wieder jemand von Hand nachprüft. KI-Werkzeuge, die Fehlerklassen lernen, brauchen viele gelabelte Bilder jedes Fehlers, und die haben Sie selten, bei einem neuen Produkt nie.",
            "VisionInspect geht einen anderen Weg. Es lernt, wie eine gute Platine aussieht, und markiert alles, was abweicht. Auch seltene, neue oder unerwartete Fehler werden erkannt, einfach weil sie nicht wie eine gute Platine aussehen.",
          ],
        },
        {
          h2: "Was auf der Platine erkannt wird",
          tiles: [
            ["Fehlende Bauteile", "Ein Bauteil, das bestückt sein sollte, fehlt."],
            ["Zusätzliche Bauteile", "Teile, die nicht dorthin gehören, auch lose Teile auf der Platine."],
            ["Verbogene Bauteile und Pins", "Pins und Bauteile, die schief stehen."],
            ["Lötfehler", "Lötstellen, die anders aussehen als auf einer guten Platine."],
            ["Flussmittelreste und Verschmutzung", "Rückstände, Staub, Fingerabdrücke und andere Verschmutzungen."],
            ["Druckfehler", "Verwischte oder fehlende Beschriftungen und Kennzeichnungen."],
          ],
        },
        {
          h2: "So funktioniert es",
          steps: [
            ["Gutplatinen zeigen", "Referenzfoto aufnehmen, Prüfbereich markieren und Fotos guter Platinen hinzufügen. Fehlerbilder sind optional."],
            ["Modell erstellen", "Ein Klick. Jedes Foto wird automatisch an der Referenz ausgerichtet, und das Modell lernt, wie eine gute Platine aussieht."],
            ["Testen und Grenzwert setzen", "Testbilder prüfen, Heatmaps ansehen und einen einzigen i.O./n.i.O.-Grenzwert festlegen."],
            ["Live oder im Stapel prüfen", "Kamera oder Ordner anbinden. Jede Platine erhält Heatmap, Score und i.O. oder n.i.O., direkt neben der ähnlichsten Gutplatine."],
          ],
        },
        {
          h2: "Zweite Prüfung nach der AOI",
          paras: [
            "Wenn Sie bereits eine automatische optische Inspektion (AOI) einsetzen, kann VisionInspect die Platinen ein zweites Mal prüfen, mit den Bildern, die Ihr AOI-System speichert, oder mit einer eigenen Kamera. Richten Sie es auf den Ordner, in den Ihre AOI schreibt, und jedes neue Bild wird sofort geprüft.",
          ],
        },
        { h2: "Passt in Ihre Linie", tiles: integrationsDe },
        {
          h2: "Ihre Daten bleiben in Ihrem Werk",
          paras: [
            "VisionInspect läuft auf einem PC oder Server in Ihrem eigenen Netzwerk und funktioniert komplett offline; auch Installationen ohne Netzwerkverbindung (air-gapped) werden unterstützt. Nichts verlässt Ihr Netzwerk, solange Sie die optionale KI-Zweitmeinung nicht einschalten.",
            "Sie brauchen einen PC mit NVIDIA-Grafikkarte. Wir entwickeln und testen auf einem Laptop mit NVIDIA-RTX-GPU mit 4 GB Grafikspeicher; mehr Grafikspeicher wird empfohlen.",
          ],
        },
      ],
      faq: [
        ["Wie viele Gutplatinen brauche ich?", "Im besten Fall eine, wenn Ihre Platinen immer gleich aussehen: Der verbogene Pin auf dieser Seite wurde von einem Modell gefunden, das mit einer einzigen Gutplatine angelernt wurde. Variieren Ihre Gutteile stärker, fügen Sie weitere hinzu und prüfen Sie das Ergebnis im Testschritt."],
        ["Funktioniert es zusammen mit unserer AOI?", "Ja. Es kann die Bilder prüfen, die Ihr AOI-System speichert, oder eine eigene Kamera nutzen. Was es an Ihrer Linie bringt, zeigt am besten ein einwöchiger Test mit Ihren eigenen Platinen."],
        ["Brauche ich KI- oder Bildverarbeitungs-Kenntnisse?", "Nein. Ein Assistent führt Sie vom ersten Foto bis zur Live-Prüfung. Es gibt keine Modellparameter einzustellen, nur einen i.O./n.i.O.-Grenzwert."],
        ["Was, wenn eine gute Platine markiert wird?", "Fügen Sie sie als Gutteil hinzu oder markieren Sie das Ergebnis als „war doch in Ordnung“, und das Modell berücksichtigt es. Mit Zonen können Sie Bereiche ausnehmen, die sich von Platine zu Platine ändern."],
        ["Welche Kameras kann ich verwenden?", "IP-Kameras per RTSP, USB-Kameras, eine Webcam im Browser oder jedes Gerät, das Bilder in einen von VisionInspect überwachten Ordner speichert."],
      ],
      cta: {
        h2: "Testen Sie es mit Ihren eigenen Platinen",
        text: "Senden Sie uns ein paar Fotos guter Platinen, und von Fehlern, falls vorhanden. Wir melden uns, um eine Demo oder einen einwöchigen Test mit Ihren eigenen Teilen zu vereinbaren.",
      },
    },
  },

  // ---------------------------------------------------------------- Assembly
  {
    key: "assembly",
    icon: "i-list",
    en: {
      title: "Manual Assembly Monitoring with AI Cameras | VisionInspect",
      description: "Camera-based monitoring for manual assembly and packing stations. Learns the work steps from one correct cycle and flags skipped steps, wrong order and cycle times.",
      crumb: "Assembly monitoring",
      eyebrow: "Manual assembly monitoring",
      h1: "Catch skipped assembly steps at the bench",
      lead: "VisionInspect watches manual assembly and packing stations through a camera. It learns the correct work sequence from one recorded cycle and flags skipped steps, wrong order and cycle times that are too long or too short, live, while the part is still at the bench.",
      facts: ["Learns from one correct cycle", "Live check with a camera", "Every cycle logged", "Runs offline"],
      teaser: "Skipped steps, wrong order and cycle times at manual assembly and packing stations, learned from one correct cycle.",
      sections: [
        {
          h2: "Why steps get skipped",
          paras: [
            "Manual assembly depends on people doing the same steps in the same order, cycle after cycle. Late in a shift, during a rush or with a new colleague, a step gets missed: a part not inserted, a label not applied, a manual not packed. Often nobody notices until the customer does.",
            "VisionInspect checks every cycle on camera, so a missed step is caught at the bench, not in a customer complaint.",
          ],
        },
        {
          h2: "What it detects",
          tiles: [
            ["Skipped steps", "A step in the sequence was not done."],
            ["Wrong order", "Steps were done in a different order than taught."],
            ["Repeated steps", "A step was done more than once."],
            ["Steps too short or too long", "A step took much less or much more time than expected."],
            ["Idle time", "Time in the cycle when nothing happened."],
            ["Cycle time against target", "Every cycle is logged with its time against the target, with CSV export."],
          ],
        },
        {
          h2: "How it works",
          steps: [
            ["Record one correct cycle", "Upload a video of the work done right."],
            ["Mark the steps", "Mark where each step starts and ends on the timeline."],
            ["Click Learn", "VisionInspect learns the steps, then replays the teaching video by itself to check what it learned."],
            ["Run it live", "Point a camera at the bench. Every cycle is checked and logged."],
          ],
        },
        {
          h2: "Checks the work instead of directing it",
          paras: [
            "Worker guidance systems tell the operator what to do next. VisionInspect does something different: it watches what was actually done and flags deviations from the taught sequence. Apart from a camera pointed at the bench, the workstation stays as it is.",
            "It can also follow an object, such as the box being packed, so its exact position on the bench doesn’t matter. It has been tested with 5-minute cycles; longer ones are possible.",
          ],
        },
        { h2: "Connects to your line", tiles: integrationsEn },
      ],
      faq: [
        ["Does it record our workers?", "It analyses the camera image to check the work steps. Everything stays on your own PC, you decide how long images and results are kept, and roles control who can see what. In Germany and many other countries, camera use at workstations should be agreed with your works council and data protection officer before you start."],
        ["How long can a cycle be?", "It has been tested with 5-minute cycles; longer ones are possible."],
        ["Does the position of the part on the bench matter?", "Not necessarily. VisionInspect can follow an object, such as the box being packed, so the steps are recognised wherever it is on the bench."],
        ["Can it also check the finished product?", "Yes. The Industrial Inspection module in the same app checks finished parts against good ones and flags any deviation."],
        ["What happens when a step is skipped?", "The cycle is flagged and logged. Through Modbus TCP, MQTT, webhooks or the GPIO edge agent you can tell your PLC or MES, or switch a signal lamp."],
      ],
      cta: {
        h2: "Show us your station",
        text: "Send us a short video of one correct cycle at your station. We’ll get back to you to arrange a demo or a 1-week trial.",
      },
    },
    de: {
      title: "Montageüberwachung an Handarbeitsplätzen mit KI | VisionInspect",
      description: "Kamerabasierte Prüfung an Montage- und Packplätzen: lernt die Arbeitsschritte aus einem korrekten Zyklus und meldet ausgelassene Schritte und falsche Reihenfolge.",
      crumb: "Montageüberwachung",
      eyebrow: "Montageüberwachung an Handarbeitsplätzen",
      h1: "Ausgelassene Montageschritte direkt am Arbeitsplatz erkennen",
      lead: "VisionInspect beobachtet manuelle Montage- und Packplätze über eine Kamera. Es lernt die richtige Arbeitsfolge aus einem einzigen aufgezeichneten Zyklus und meldet ausgelassene Schritte, falsche Reihenfolge und zu lange oder zu kurze Zykluszeiten, live, solange das Teil noch am Arbeitsplatz ist.",
      facts: ["Lernt aus einem korrekten Zyklus", "Live-Prüfung per Kamera", "Jeder Zyklus protokolliert", "Läuft offline"],
      teaser: "Ausgelassene Schritte, falsche Reihenfolge und Zykluszeiten an Montage- und Packplätzen, gelernt aus einem korrekten Zyklus.",
      sections: [
        {
          h2: "Warum Schritte ausgelassen werden",
          paras: [
            "Manuelle Montage lebt davon, dass Menschen Zyklus für Zyklus dieselben Schritte in derselben Reihenfolge ausführen. Am Ende einer langen Schicht, unter Zeitdruck oder bei neuen Kolleginnen und Kollegen fällt ein Schritt weg: ein Teil nicht eingelegt, ein Etikett nicht aufgeklebt, eine Anleitung nicht beigepackt. Oft merkt es erst der Kunde.",
            "VisionInspect prüft jeden Zyklus per Kamera. Ein vergessener Schritt fällt am Arbeitsplatz auf, nicht erst in der Reklamation.",
          ],
        },
        {
          h2: "Was erkannt wird",
          tiles: [
            ["Ausgelassene Schritte", "Ein Schritt der Arbeitsfolge wurde nicht ausgeführt."],
            ["Falsche Reihenfolge", "Schritte wurden in anderer Reihenfolge als angelernt ausgeführt."],
            ["Wiederholte Schritte", "Ein Schritt wurde mehrfach ausgeführt."],
            ["Zu kurze oder zu lange Schritte", "Ein Schritt dauerte deutlich kürzer oder länger als erwartet."],
            ["Leerlaufzeit", "Zeit im Zyklus, in der nichts passiert ist."],
            ["Zykluszeit gegen Sollzeit", "Jeder Zyklus wird mit seiner Zeit gegen die Sollzeit protokolliert, mit CSV-Export."],
          ],
        },
        {
          h2: "So funktioniert es",
          steps: [
            ["Einen korrekten Zyklus aufnehmen", "Ein Video der richtig ausgeführten Arbeit hochladen."],
            ["Schritte markieren", "Auf der Zeitleiste markieren, wo jeder Schritt beginnt und endet."],
            ["Auf „Lernen“ klicken", "VisionInspect lernt die Schritte und spielt das Anlernvideo danach selbst ab, um das Gelernte zu prüfen."],
            ["Live betreiben", "Kamera auf den Arbeitsplatz richten. Jeder Zyklus wird geprüft und protokolliert."],
          ],
        },
        {
          h2: "Prüft die Arbeit, statt sie anzuleiten",
          paras: [
            "Werkerführungssysteme sagen dem Werker, was als Nächstes zu tun ist. VisionInspect macht etwas anderes: Es beobachtet, was tatsächlich getan wurde, und meldet Abweichungen von der angelernten Arbeitsfolge. Bis auf eine Kamera über dem Arbeitsplatz bleibt der Arbeitsplatz, wie er ist.",
            "Es kann außerdem einem Objekt folgen, etwa dem Karton, der gepackt wird, sodass dessen genaue Position auf dem Tisch keine Rolle spielt. Getestet wurde mit Zyklen von 5 Minuten; längere sind möglich.",
          ],
        },
        { h2: "Anbindung an Ihre Linie", tiles: integrationsDe },
      ],
      faq: [
        ["Werden unsere Mitarbeitenden aufgezeichnet?", "VisionInspect wertet das Kamerabild aus, um die Arbeitsschritte zu prüfen. Alles bleibt auf Ihrem eigenen PC, Sie legen fest, wie lange Bilder und Ergebnisse gespeichert werden, und Rollen regeln, wer was sehen darf. Den Kameraeinsatz am Arbeitsplatz sollten Sie vorab mit Betriebsrat und Datenschutzbeauftragten abstimmen."],
        ["Wie lang darf ein Zyklus sein?", "Getestet wurde mit Zyklen von 5 Minuten; längere sind möglich."],
        ["Spielt die Position des Teils auf dem Tisch eine Rolle?", "Nicht unbedingt. VisionInspect kann einem Objekt folgen, etwa dem Karton, der gepackt wird, sodass die Schritte erkannt werden, wo auch immer er steht."],
        ["Kann es auch das fertige Produkt prüfen?", "Ja. Das Modul Industrielle Prüfung in derselben App prüft fertige Teile gegen Gutteile und markiert jede Abweichung."],
        ["Was passiert, wenn ein Schritt fehlt?", "Der Zyklus wird markiert und protokolliert. Über Modbus TCP, MQTT, Webhooks oder den GPIO-Edge-Agent können Sie Ihre SPS oder Ihr MES informieren oder eine Signallampe schalten."],
      ],
      cta: {
        h2: "Zeigen Sie uns Ihren Arbeitsplatz",
        text: "Senden Sie uns ein kurzes Video eines korrekten Zyklus an Ihrem Arbeitsplatz. Wir melden uns, um eine Demo oder einen einwöchigen Test zu vereinbaren.",
      },
    },
  },

  // ---------------------------------------------------------------- Anomaly detection
  {
    key: "anomaly",
    icon: "i-search",
    en: {
      title: "Visual Inspection Without Defect Images | VisionInspect",
      description: "AI visual inspection that learns from good parts only. Anomaly detection finds scratches, contamination and unknown defects without collecting defect images.",
      crumb: "Inspection without defect images",
      eyebrow: "Anomaly detection for quality control",
      h1: "Visual inspection without defect images",
      lead: "Most AI inspection tools need many images of every defect before they work. VisionInspect needs only good parts: it learns what good looks like and flags anything that differs, including defects nobody has seen before.",
      facts: ["Trained on good parts only", "Flags unknown defects", "One pass/fail limit", "Runs offline"],
      teaser: "Anomaly detection that learns from good parts only, for surface defects on metal, plastic, glass and painted parts.",
      sections: [
        {
          h2: "The problem with defect images",
          paras: [
            "On a good line, defects are rare, and a new product has none at all. Collecting and labelling enough examples of every defect type can take months, and the next defect may look different from all of them.",
            "Anomaly detection turns the problem around. Instead of learning what bad looks like, it learns what good looks like, and everything else stands out.",
          ],
        },
        {
          h2: "How it works",
          steps: [
            ["Show it good parts", "Take a reference photo, mark the area to inspect and add photos of good parts."],
            ["Automatic alignment", "Every photo is aligned to the reference picture, so parts don’t have to sit in exactly the same place."],
            ["Heat map and score", "For each new part, areas that differ from the good parts light up in a heat map, and the part gets a score."],
            ["One limit, PASS or FAIL", "You set a single pass/fail limit. The score turns into a clear verdict for every part."],
          ],
        },
        { figure: true },
        {
          h2: "Three ways to automate visual inspection",
          table: {
            head: ["", "Rule-based machine vision", "Deep learning with defect classes", "Anomaly detection (VisionInspect)"],
            rows: [
              ["What you provide", "Rules programmed for each feature", "Many labelled images of every defect", "Images of good parts"],
              ["New or unknown defects", "Only if a rule happens to cover them", "Often missed, as they were never trained", "Flagged as a deviation from good"],
              ["Setup effort", "Machine vision expertise", "Collecting and labelling defect data", "Good samples and one limit"],
              ["Best for", "Exact measurements, codes, fixed features", "Sorting defects into known classes", "Finding any deviation from a good part"],
            ],
          },
        },
        {
          h2: "Where it works well, and where it doesn’t",
          cols: [
            {
              h3: "Works well",
              items: [
                "Parts that look the same every time",
                "Defects that are rare, varied or new",
                "New products with no defect history",
                "Electronics and PCBs, metal, plastic, glass and painted surfaces, packaging",
              ],
            },
            {
              h3: "Less suited",
              items: [
                "Exact measurements against tolerances: that is a job for gauging",
                "Parts whose good appearance varies a lot: this needs more good samples, and zones to leave out areas that change",
                "Naming the defect type: it shows where a part differs, not what the defect is called. The optional AI second opinion can add a written comment.",
              ],
            },
          ],
        },
        {
          h2: "Surface defects on any material",
          paras: [
            "Because it compares with good parts instead of looking for one defect type, the same approach finds scratches, dents, contamination, print errors and missing or extra parts on metal, plastic, glass or painted parts, as well as missing items in packs and boxes.",
          ],
        },
      ],
      faq: [
        ["How many good samples do I need?", "It depends on how much your good parts vary. For the bent-pin example on this page, one good board was enough. Start with a set of good parts, then use the Test step. If OK parts are flagged, add them as good samples."],
        ["What about harmless variation between good parts?", "Good parts that are flagged can be added as good samples, or marked “this was actually OK”, and the model takes them into account. Zones let you leave out areas that change from part to part."],
        ["Can I add defect images anyway?", "Yes. You can add bad samples to check that your pass/fail limit is right, but you don’t have to."],
        ["Do I need a data scientist?", "No. It’s built for the people who run the line. There are no model names or settings to tune, only one pass/fail limit."],
        ["Does any data leave my network?", "Not by default. Everything runs locally and works offline. Only if you turn on the optional AI check are images of failed parts sent, to the AI account you configured."],
      ],
      cta: {
        h2: "Try it on your own parts",
        text: "Send us a few photos of good parts. We’ll get back to you to arrange a demo or a 1-week trial on your own parts.",
      },
    },
    de: {
      title: "KI-Sichtprüfung ohne Fehlerbilder | VisionInspect",
      description: "KI-Sichtprüfung, die nur aus Gutteilen lernt. Die Anomalieerkennung findet Kratzer, Verschmutzung und unbekannte Fehler, ohne dass Sie Fehlerbilder sammeln müssen.",
      crumb: "Sichtprüfung ohne Fehlerbilder",
      eyebrow: "Anomalieerkennung für die Qualitätskontrolle",
      h1: "KI-Sichtprüfung ohne Fehlerbilder",
      lead: "Die meisten KI-Prüfsysteme brauchen viele Bilder jedes Fehlers, bevor sie funktionieren. VisionInspect braucht nur Gutteile: Es lernt, wie ein gutes Teil aussieht, und markiert alles, was abweicht, auch Fehler, die noch niemand gesehen hat.",
      facts: ["Nur mit Gutteilen angelernt", "Erkennt unbekannte Fehler", "Ein i.O./n.i.O.-Grenzwert", "Läuft offline"],
      teaser: "Anomalieerkennung, die nur aus Gutteilen lernt, für Oberflächenfehler auf Metall, Kunststoff, Glas und lackierten Teilen.",
      sections: [
        {
          h2: "Das Problem mit Fehlerbildern",
          paras: [
            "In einer guten Fertigung sind Fehler selten, und ein neues Produkt hat noch gar keine. Genügend Beispiele jeder Fehlerart zu sammeln und zu labeln kann Monate dauern, und der nächste Fehler sieht womöglich anders aus als alle bisherigen.",
            "Die Anomalieerkennung dreht das Problem um. Statt zu lernen, wie ein Fehler aussieht, lernt sie, wie ein Gutteil aussieht, und alles andere fällt auf.",
          ],
        },
        {
          h2: "So funktioniert es",
          steps: [
            ["Gutteile zeigen", "Referenzfoto aufnehmen, Prüfbereich markieren und Fotos guter Teile hinzufügen."],
            ["Automatische Ausrichtung", "Jedes Foto wird an der Referenz ausgerichtet, die Teile müssen also nicht exakt an derselben Stelle liegen."],
            ["Heatmap und Score", "Bei jedem neuen Teil leuchten Bereiche, die von den Gutteilen abweichen, in einer Heatmap auf, und das Teil erhält einen Score."],
            ["Ein Grenzwert, i.O. oder n.i.O.", "Sie legen einen einzigen Grenzwert fest. Aus dem Score wird für jedes Teil ein klares Ergebnis."],
          ],
        },
        { figure: true },
        {
          h2: "Drei Wege, die Sichtprüfung zu automatisieren",
          table: {
            head: ["", "Regelbasierte Bildverarbeitung", "Deep Learning mit Fehlerklassen", "Anomalieerkennung (VisionInspect)"],
            rows: [
              ["Was Sie liefern", "Für jedes Merkmal programmierte Regeln", "Viele gelabelte Bilder jedes Fehlers", "Bilder von Gutteilen"],
              ["Neue oder unbekannte Fehler", "Nur, wenn zufällig eine Regel greift", "Oft übersehen, da nie angelernt", "Als Abweichung vom Gutteil markiert"],
              ["Aufwand für die Einrichtung", "Bildverarbeitungs-Know-how", "Fehlerdaten sammeln und labeln", "Gutteile und ein Grenzwert"],
              ["Am besten für", "Exakte Messungen, Codes, feste Merkmale", "Fehler in bekannte Klassen sortieren", "Jede Abweichung vom Gutteil finden"],
            ],
          },
        },
        {
          h2: "Wo es gut funktioniert und wo nicht",
          cols: [
            {
              h3: "Gut geeignet",
              items: [
                "Teile, die jedes Mal gleich aussehen",
                "Fehler, die selten, vielfältig oder neu sind",
                "Neue Produkte ohne Fehlerhistorie",
                "Elektronik und Leiterplatten, Metall, Kunststoff, Glas und lackierte Oberflächen, Verpackungen",
              ],
            },
            {
              h3: "Weniger geeignet",
              items: [
                "Exakte Messungen gegen Toleranzen: Das ist eine Aufgabe für die Messtechnik",
                "Teile, deren gutes Aussehen stark schwankt: Das braucht mehr Gutteile und Zonen, um wechselnde Bereiche auszunehmen",
                "Die Fehlerart benennen: Es zeigt, wo ein Teil abweicht, nicht, wie der Fehler heißt. Die optionale KI-Zweitmeinung kann einen schriftlichen Kommentar ergänzen.",
              ],
            },
          ],
        },
        {
          h2: "Oberflächenprüfung auf jedem Material",
          paras: [
            "Weil es mit Gutteilen vergleicht, statt nach einer bestimmten Fehlerart zu suchen, findet derselbe Ansatz Kratzer, Dellen, Verschmutzung, Druckfehler und fehlende oder zusätzliche Teile auf Metall, Kunststoff, Glas oder lackierten Teilen, ebenso fehlende Artikel in Packungen und Kartons.",
          ],
        },
      ],
      faq: [
        ["Wie viele Gutteile brauche ich?", "Das hängt davon ab, wie stark Ihre Gutteile variieren. Für das Beispiel mit dem verbogenen Pin auf dieser Seite reichte eine einzige Gutplatine. Beginnen Sie mit einer Reihe von Gutteilen und nutzen Sie dann den Testschritt. Werden gute Teile markiert, fügen Sie sie als Gutteile hinzu."],
        ["Was ist mit harmlosen Unterschieden zwischen Gutteilen?", "Markierte Gutteile können Sie als Gutteile hinzufügen oder als „war doch in Ordnung“ kennzeichnen, und das Modell berücksichtigt das. Mit Zonen nehmen Sie Bereiche aus, die sich von Teil zu Teil ändern."],
        ["Kann ich trotzdem Fehlerbilder hinzufügen?", "Ja. Mit Schlechtteilen können Sie prüfen, ob Ihr Grenzwert richtig sitzt, Pflicht ist das aber nicht."],
        ["Brauche ich einen Data Scientist?", "Nein. Es ist für die Menschen an der Linie gebaut. Es gibt keine Modellnamen oder Parameter, nur einen i.O./n.i.O.-Grenzwert."],
        ["Verlassen Daten mein Netzwerk?", "Standardmäßig nicht. Alles läuft lokal und funktioniert offline. Nur wenn Sie die optionale KI-Prüfung einschalten, werden Bilder fehlerhafter Teile an das von Ihnen eingerichtete KI-Konto gesendet."],
      ],
      cta: {
        h2: "Testen Sie es mit Ihren eigenen Teilen",
        text: "Senden Sie uns ein paar Fotos guter Teile. Wir melden uns, um eine Demo oder einen einwöchigen Test mit Ihren eigenen Teilen zu vereinbaren.",
      },
    },
  },
];

export { pages, ui };
