# Estimator

## Requirements

- Cross-platform GUI
- Field that sets the buffer percentage
- Table of items consisting of at least two fields: item description and item hours
- Question and answer list
- Button to copy estimate into clipboard
- Save and load functionality

## Design

- App → Navigation toolbar with router-outlet underneath. Also has buttons to save and load the estimate, along with a button to export the estimate in Markdown. Display progress bar with answered questions plus a warning if there are unanswered questions.
- Estimate → Table, along with a field to set the buffer percentage. Also displays the subtotal estimate and the total estimate (i.e. with the buffer and rounded up).
- Analysis → Question and answer list.
- All state is captured in a singleton service.

TODO: Add save and load functionality.
