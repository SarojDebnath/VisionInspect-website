---
title: "Candle visual inspection: three defect images detected"
description: "A candle inspection test trained on 12 good images caught three defective images and accepted one good image. See how the automatic limit worked."
date: 2026-11-13
lang: en
translationKey: candle-inspection-three-defects
image: /img/blog/candle-visual-inspection/caught-2.webp
imageAlt: "VisionInspect compares candle images and highlights an unusual area in the test image with a FAIL result."
tags: ["visual-inspection", "candles", "anomaly-detection"]
related: anomaly
---
Is this candle acceptable, or should it be rejected? At an inspection station, you need a decision you can review—not just a coloured mark on an image. This candle test shows how VisionInspect learned from 12 good images, then flagged three defective test images as FAIL. It also accepted the one good image checked in the test.

## The result: three defective images detected

VisionInspect was trained on 12 good images for this test. The app set the pass/fail limit automatically, using only those good images. It then checked one good image and three defective images.

All three defective images were detected, with none missed. The one good image was accepted rather than falsely rejected. The table separates the training images from the images used to check the results:

| Check | Result |
| --- | --- |
| Good images used for training | 12 |
| Limit setting | Automatic, from good images only |
| Good images tested | 1 |
| Defective images tested | 3 |
| Defective images detected | 3 |
| Defective images missed | 0 |
| Good images falsely rejected | 0 |
| Score in the result shown | 0.138 |
| Pass/fail limit | 0.1 |

**This is a small test, not proof of a detection rate for production.** It shows that an inspection learned from good images could distinguish these three defective images from the one good image tested.

## Why the image shown failed

In the result shown, the score is **0.138** and the limit is **0.1**. Because the score exceeds the limit, VisionInspect returns **FAIL**. The coloured highlight shows the unusual area in the test image.

![VisionInspect candle inspection result showing a highlighted anomaly and a FAIL verdict.](/img/blog/candle-visual-inspection/caught-2.webp "Candle inspection: FAIL at a score of 0.138 against a limit of 0.1. Trained on 12 good images; imagery from the public VisA dataset (CC BY 4.0).")

The inspection results were prepared by VisionInspect. The images come from [the public VisA dataset (CC BY 4.0)](https://github.com/amazon-science/spot-diff).

For an operator, the heat map and the verdict serve different purposes. The heat map shows where the unusual area is; the score and limit explain why the image failed. The score is not a percentage probability of a defect—it is the value the app compares against the inspection limit.

## Good images provide the basis for inspection

This test used only good images for training and for setting the automatic limit. The defective images were checked afterwards to test the inspection. That distinction matters: the model did not need a training example of each of these defects before it could flag them.

VisionInspect learns from good parts. You can start with 3 good images, with 10–30 recommended. The 12 good images used here fall within that recommendation, and the app automatically aligns photos to the reference.

Defective samples are optional. From 5 defective samples onwards, they can be used to check and fine-tune the pass/fail limit. In this candle test, the limit set automatically from good images remained the basis for the decisions.

## Training on a laptop

Training took about 20 minutes on a laptop GPU with 4 GB of GPU memory. That was the time spent learning from the good images, not the time needed to inspect an individual image.

For your own trial, separate these two tasks: first train the inspection on good parts, then check its decisions on additional images. Do not look only at whether it flags a known defective part. Check whether it also accepts further parts that your quality team has approved.

## What to check at your own inspection station

Start with images of good parts that your quality team has approved. Let VisionInspect learn from them and propose a limit. Then inspect additional good parts and any available defective parts, reviewing the heat map, score and PASS/FAIL verdict together.

Use the highlighted area to review a failed inspection. Compare that area with your own assessment of the part. This checks both the verdict and whether the area flagged by the system matters to your quality decision.

For the underlying approach, see [visual inspection without defect images](/visual-inspection-without-defect-images/). VisionInspect runs locally and offline on your PC or server; nothing leaves the plant unless you enable the optional AI second opinion. That second opinion can add a short comment to a failed inspection, but it does not change the verdict.

## The next step with your parts

Send photos of your approved good parts for a demo, or start a **1-week trial with your own parts**. Then use additional good parts and available defective parts to check the proposed limit and review the highlighted areas yourself.
