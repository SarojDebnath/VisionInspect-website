---
title: "KI-Sichtprüfung von Kerzen: drei Fehlerbilder erkannt"
description: "Ein Kerzentest mit 12 Gutbildern: drei Fehlerbilder erkannt, ein Gutbild akzeptiert. So entstehen Prüfentscheidungen mit automatisch gesetzter Grenze."
date: 2026-11-13
lang: de
translationKey: candle-inspection-three-defects
image: /img/blog/candle-visual-inspection/caught-2.webp
imageAlt: "VisionInspect zeigt Kerzen im Bildvergleich und markiert eine auffällige Stelle im Prüfbild mit dem Ergebnis FAIL."
tags: ["sichtpruefung", "kerzen", "anomalieerkennung"]
related: anomaly
---
Ist diese Kerze noch i.O. oder muss sie aussortiert werden? Am Prüfplatz brauchen Sie dafür eine nachvollziehbare Entscheidung, nicht nur eine farbige Markierung. Dieser Kerzentest zeigt, wie VisionInspect mit 12 Gutbildern eine Prüfgrundlage lernt und anschließend drei fehlerhafte Testbilder als n.i.O. einstuft. Das zusätzlich geprüfte Gutbild wurde akzeptiert.

## Das Ergebnis: drei Fehlerbilder erkannt

Für den Test wurde VisionInspect mit 12 Gutbildern trainiert. Die App setzte die Gut/Schlecht-Grenze automatisch und ausschließlich anhand dieser Gutbilder. Anschließend wurden ein Gutbild und drei fehlerhafte Bilder geprüft.

Alle drei Fehlerbilder wurden erkannt, keines wurde übersehen. Das eine Gutbild wurde nicht fälschlich zurückgewiesen. Die folgende Übersicht trennt die Lernbilder von den anschließend geprüften Bildern:

| Prüfpunkt | Ergebnis |
| a | b |
| Gutbilder für das Training | 12 |
| Festlegung der Grenze | Automatisch, nur aus Gutbildern |
| Geprüfte Gutbilder | 1 |
| Geprüfte Fehlerbilder | 3 |
| Erkannte Fehlerbilder | 3 |
| Übersehene Fehlerbilder | 0 |
| Fälschlich zurückgewiesene Gutbilder | 0 |
| Score im gezeigten Ergebnis | 0.138 |
| Gut/Schlecht-Grenze | 0.1 |

Das ist ein kleiner Test, kein Nachweis einer Erkennungsrate für die Serienproduktion. Er zeigt konkret, dass die aus Gutbildern gelernte Prüfung diese drei fehlerhaften Bilder von dem geprüften Gutbild unterscheiden konnte.

## Warum das gezeigte Bild n.i.O. ist

Im abgebildeten Ergebnis liegt der Score bei **0.138**, die Grenze bei **0.1**. Der Score überschreitet damit die Grenze; VisionInspect zeigt **FAIL**, also n.i.O. Die farbige Markierung macht die auffällige Stelle im Prüfbild sichtbar.

![VisionInspect-Prüfergebnis für Kerzen mit markierter Auffälligkeit und FAIL-Anzeige.](/img/blog/candle-visual-inspection/caught-2.webp "Kerzenprüfung: FAIL bei Score 0.138 und Grenze 0.1. Trainiert mit 12 Gutbildern; Bildmaterial aus dem öffentlichen VisA-Datensatz (CC BY 4.0).")

Die Prüfergebnisse wurden von VisionInspect erstellt. Das Bildmaterial stammt aus [dem öffentlichen VisA-Datensatz (CC BY 4.0)](https://github.com/amazon-science/spot-diff).

Für den Werker erfüllen Markierung und Prüfentscheidung unterschiedliche Aufgaben: Die Heatmap zeigt, wo die Auffälligkeit liegt. Score und Grenze machen nachvollziehbar, warum das Bild als n.i.O. eingestuft wurde. Der Score ist dabei keine prozentuale Fehlerwahrscheinlichkeit, sondern der Wert, den die App gegen die eingestellte Grenze prüft.

## Gutbilder liefern die Prüfgrundlage

In diesem Versuch kamen für das Lernen und das automatische Setzen der Grenze nur Gutbilder zum Einsatz. Die fehlerhaften Bilder dienten anschließend dazu, die Prüfung zu kontrollieren. Diese Trennung ist wichtig: Ein erkanntes Fehlerbild wurde hier nicht zuvor als notwendiges Lernbeispiel für genau diesen Fehler verwendet.

VisionInspect lernt grundsätzlich aus Gutteilen. Der Einstieg ist mit 3 Gutbildern möglich; empfohlen sind 10–30. Die hier eingesetzten 12 Gutbilder liegen innerhalb dieser Empfehlung. Fotos richtet die App automatisch an der Referenz aus.

Schlechtteile sind optional. Ab 5 Schlechtbildern können sie zur Kontrolle und Feinabstimmung der Gut/Schlecht-Grenze eingesetzt werden. Im Kerzentest blieb die automatisch aus Gutbildern gesetzte Grenze die Grundlage der Entscheidung.

## Training auf einem Laptop

Das Training dauerte in diesem Versuch etwa 20 Minuten auf einer Laptop-GPU mit 4 GB GPU-Speicher. Diese Zeit beschreibt das Lernen aus den Gutbildern, nicht die laufende Prüfung eines einzelnen Bildes.

Für einen eigenen Versuch trennen Sie deshalb zwei Aufgaben: zuerst die Prüfgrundlage aus Gutteilen aufbauen, danach die Entscheidungen an weiteren Bildern kontrollieren. Entscheidend ist dabei nicht allein, ob ein bekanntes Schlechtteil auffällt. Prüfen Sie ebenso, ob weitere freigegebene Gutteile als i.O. durchlaufen.

## Was Sie am eigenen Prüfplatz kontrollieren sollten

Beginnen Sie mit Gutbildern, die Ihre Qualitätssicherung tatsächlich freigegeben hat. Lassen Sie VisionInspect daraus die Prüfung lernen und eine Grenze vorschlagen. Kontrollieren Sie anschließend weitere Gutteile und vorhandene Schlechtteile anhand von Heatmap, Score und i.O./n.i.O.-Entscheidung.

Nutzen Sie die Markierung, um eine n.i.O.-Entscheidung am Bild nachzuvollziehen. Vergleichen Sie die hervorgehobene Stelle mit Ihrer eigenen Bewertung des Teils. So prüfen Sie nicht nur das angezeigte Ergebnis, sondern auch, ob die auffällige Bildstelle für Ihre Qualitätsentscheidung relevant ist.

Die technische Grundlage finden Sie auf der Seite zur [Sichtprüfung ohne Fehlerbilder](/de/sichtpruefung-ohne-fehlerbilder/). VisionInspect läuft lokal und offline auf Ihrem PC oder Server; ohne aktivierte optionale KI-Zweitmeinung verlassen keine Bilder das Werk. Diese Zweitmeinung kann fehlgeschlagene Prüfungen kurz kommentieren, ändert aber nicht das Urteil.

## Der nächste Schritt mit Ihren Teilen

Senden Sie Fotos Ihrer freigegebenen Gutteile für eine Demo oder starten Sie einen **1-wöchigen Test mit Ihren eigenen Teilen**. Nutzen Sie anschließend weitere Gutteile und vorhandene Schlechtteile, um die vorgeschlagene Grenze und die markierten Auffälligkeiten selbst zu prüfen.
