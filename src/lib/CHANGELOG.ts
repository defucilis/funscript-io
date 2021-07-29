//there has to be a better way than this... :I
const changelog = `
## v0.9.1

### 29th July 2021

#### Added

  * Double-clicking the video player now toggles fullscreen

### Fixed

  * The Limiter modifier no longer outputs broken funscripts (thanks for the bug report Ripovitan_R!)
  * Pressing space bar before loading a video no longer crashes the app
  * Space bar no longer opens the file dialog again if it was previously clicked (rather than drag+dropped)

---

## v0.9.0

### 30th June 2021

#### Added

  * The Cycler now has an ease in / ease out balance slider to control the length and midpoint of the speed curves

---

## v0.8.0

### 26th May 2021

#### Added

  * Custom javascript functions can now be used to mutate a funscripts Actions array in the Modify Script page

#### Fixed

  * Replaced the "_HALVED" suffix to modified funscripts with "_MODIFIED"

---

## v0.7.3

### 15th May 2021

#### Changed

  * Made the changelog easier to update!

#### Fixed

  * Fixed a bug preventing scripts from appearing in the Browse section

---

## v0.7.2

### 29th April 2021

#### Fixed

  * Fixed a bug where under certain circumstances, funscripts would report invalid values for Average Speed
  * Made it possible to refresh the page when in sub-pages (like /modify) without getting a 404 error

---

## v0.7.1

### 28th April 2021

#### Fixed

  * Solved a crash when attempting to edit the metadata of a script without existing performers or tags keys

---

## v0.7.0

### 18th April 2021

#### Added

  * Funscripts can now have their metadata edited in the Modify page
  * Added ScriptAxis top scripts browser to the Browse page!

---

## v0.6.1

### 18th April 2021

#### Fixed

  * Funscript popups now filter for .funscript files (suggestion by spuzz1127)

---

## v0.6.0

### 16th April 2021

#### Added (suggestions by spuzz1127)

  * Video playback can now be toggled by clicking the video
  * Clicking the heatmap preview in the local player seeks through the video
  * Funscripts can be previewed during playback by clicking the small funscript button on the bottom right of the player
  * Doesn't work in fullscreen mode

---

## v0.5.0

### 15th April 2021

#### Added

  * Added Limiter modifier to ensure a script matches a device's capabilities
  * Space bar now pauses/unpauses the local script player
  * Left/Right arrow keys now seek 10s back/forward in the local script player (suggestion by spuzz1127)
  * It is now possible to change the stroke speed/length increment amounts in manual mode (suggestion by Jupiter)
  * Added this changelog page!

#### Changed

  * Up/Down arrow keys are now used instead of left/right to change sync offset in the local script player

#### Fixed

  * Heatmaps now show gaps in the funscript (rather than continuing the color that was before the gap)

---

## v0.4.1

### 11th April 2021

#### Fixed

  * Stopped overwriting funscript metadata, oops! (thanks sentinel)

---

## v0.4.0

### 4th April 2021

#### Features

  * A better local-video script player than handyfeeling.com
  * Easy to use script-modification features
  * A better manual-mode interface
  * Procedural funscript generation
`;

export default changelog;
