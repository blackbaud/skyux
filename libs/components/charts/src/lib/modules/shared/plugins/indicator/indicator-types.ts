/**
 * Visual style properties applied when drawing an indicator box.
 */
export interface IndicatorStyles {
  /** The inner spacing between the indicator border and the element it surrounds. */
  padding: number;
  /** The corner radius of the indicator border box. */
  borderRadius: number;
  /** The CSS color of the indicator border. */
  borderColor: string;
  /** The pixel width of the indicator border. */
  borderWidth: number;
  /** The CSS color of the indicator background fill. */
  backgroundColor: string;
}

/**
 * The geometry of an indicator box, used for cartesian charts.
 */
export interface IndicatorBounds {
  /** The x center */
  x: number;
  /** The y center */
  y: number;
  /** The width of the bar */
  width: number;
  /** The height of the bar */
  height: number;
}

/**
 * The geometry of an indicator arc, used for donut charts.
 */
export interface ArcIndicatorBounds {
  /** The x-coordinate of the arc's center point. */
  x: number;
  /** The y-coordinate of the arc's center point. */
  y: number;
  /** The angle (in radians) where the slice begins. */
  startAngle: number;
  /** The angle (in radians) where the slice ends. */
  endAngle: number;
  /** The radius of the outer edge of the donut slice. */
  outerRadius: number;
}
