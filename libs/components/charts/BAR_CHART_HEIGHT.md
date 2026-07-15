# Dimensions for bar chart heights

## Overview

Chart component displays relatively uniform chart sizes given different datasets (i.e., graphic elements don’t overtake visual hierarchy for majority use case (simple charts in larger compositions of non-chart content), fit within viewport, and can been viewed in few short-distance fixations).
Support an autosize option to size chart that just works.
Offer a way to turn this off so teams can go it themselves for unique circumstances or charts and have control of the inputs needed for this (e.g. height, aspectRatio, maintainAspectRatio).

## Horizontal bars

Chart height is a calculated value that will vary depending on the number of categories and datasets. For charts with a small number of bars (e.g., <12), the bars should target a specific size (1rem) and the space for the category should target .375 of the bar width. As the number of bars increases, that width can decrease down to a minimum of 12px, but the category space needs to increase to .5rem or .75 of bar width slightly to ensure grouped bars are visually separated with whitespace.

## Vertical bars

### Chart height

Chart heights should be dynamic based on optimizing for the y-axis scale for users to be able to see visual differences clearly, but not take over the visual hierarchy of the page with its size or have to be scrolled vertically. Vertical bar charts should be between 11.25rem (180px) to 25rem (400px) given the granularity needed for tick marks.

### Bar widths

Base width: 2rem (32px)
Minimum width: .75rem (12px) - for grouped bar charts and charts with many bars.
For large width charts (over 768px): responsive widths up to 7.5rem (120px)
