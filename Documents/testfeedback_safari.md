=================================================================================================================
==== Hollis Pultz                        ========================================================================
==== Equilibrium Tester Testing Feedback ========================================================================
=================================================================================================================

==== Machine: 2017 MacBook Pro    ===============================================================================
====          with retina display ===============================================================================
==== OS: MacOS 10.14.4            ===============================================================================
==== Browser: Safari              ===============================================================================

------------------------------------------------------------------------- Graphics: Ensure Graphics Resizing ----
1. When the page is first loaded, objects (in this case squares instead of circles) are displayed with equal size
   with 50 for each of their values, and the K value is 1, but the bar is not level.
2. The objects change size as expected, however the reactants box now covers the text label for reactants and the
   percent value. Seesaw level is not changing though, despite the higher reactants.
3. The objects change size as expected.

--------------------------------------------------------------------------------- Graphics: Fulcrum Movement ----
1. Fulcrum is bounded, but when dragging, if fulcrum is dragged all the way in one direction, it cannot be
   dragged in the other direction without being re-click-and-dragged.
2. Test performed in automatic mode:
  - No values are changed when the fulcrum is moved
   Test performed in manual mode:
  - No values are changed when the fulcrum is moved

-------------------------------------------------------------------------------------- Limiting Number Boxes ----
1. Values can be input into the boxes.
2. Non-numeric and negative values cannot be entered into the product or reactants boxes.
3. Sums of products and reactants values add up to 100 consistently.

### undefined tests ###
1. Values can also be entered into the K-value box, including non-numeric and negative numbers. Non numeric
   values clear when the fulcrum is dragged, and the K-value updates for a moment, but then freezes again.
   Negative K-values are accepted and do alter the bar position. Negative values clear when the fulcrum is
   dragged, and the K-value updates for a moment, but then freezes again.

------------------------------------------------------------------------------------------- Algorithm Verify ----
1. No values are updating automatically when single values are edited by the user.
