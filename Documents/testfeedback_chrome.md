=================================================================================================================
==== Hollis Pultz                        ========================================================================
==== Equilibrium Tester Testing Feedback ========================================================================
=================================================================================================================

==== Machine: 2017 MacBook Pro    ===============================================================================
====          with retina display ===============================================================================
==== OS: MacOS 10.14.4            ===============================================================================
==== Browser: Chrome 73.0.3683.86 ===============================================================================

---- 4.1 ---------------------------------------------------------------- Graphics: Ensure Graphics Resizing ----
1. When the page is first loaded, objects (in this case squares instead of circles) are displayed with equal size
   with 50 for each of their values, and the K value is 1, and the bar is level.
2. The objects change size as expected, however the text label and percent value for products is moving sideways
   on the screen. Seesaw level is changing, though not smoothly.
3. The objects change size as expected, however the text label and percent value for products is moving sideways
   on the screen. Seesaw level is changing, though not smoothly.

---- 4.2 ------------------------------------------------------------------------ Graphics: Fulcrum Movement ----
1. Fulcrum is bounded, but when dragging, if fulcrum is dragged all the way in one direction, it cannot be
   dragged in the other direction without being re-click-and-dragged.
2. Test performed in automatic mode:
  - No values are changed when the fulcrum is moved unless K value starts at number less than 1. Once value
    reaches approximately 1, values cease updating. Behavior is not entirely consistent, because the number
    updating ceases at is a floating point number, which seems to be a little different each time.
   Test performed in manual mode:
  - No values are changed when the fulcrum is moved unless K value starts at number less than 1. Once value
    reaches approximately 1, values cease updating. Behavior is not entirely consistent, because the number
    updating ceases at is a floating point number, which seems to be a little different each time.

---- 4.3 ----------------------------------------------------------------------------- Limiting Number Boxes ----
1. Values can be input into the boxes.
2. Non-numeric and negative values cannot be entered into the product or reactants boxes.
3. Sums of products and reactants values add up to 100 consistently.

### undefined tests ###
1. Values can also be entered into the K-value box, including numeric and negative numbers. Non numeric
   values clear when the fulcrum is dragged, and the K-value updates up to apprx. 1, but then freezes again.
   Negative K-values are accepted and do alter the bar position. Negative values clear when the fulcrum is
   dragged, and the K-value updates up to apprx. 1, but then freezes again.

---- 4.4 ---------------------------------------------------------------------------------- Algorithm Verify ----
1. No values are updating automatically when single values are edited by the user. If the user first sets K to a
   number less than 1, the fulcrum position will update after making changes to the product and reactant boxes,
   but the K-value box does not reflect the changes.


