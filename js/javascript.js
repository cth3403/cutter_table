// Author Cutter Table Data - Cached for performance
let cutterTableCache = {};

// Determine which JSON file to load based on the first letter of surname
function getCutterTableFile(firstLetter) {
  const letter = firstLetter.toUpperCase();

  // Vowels: A, E, I, O, U use the vowels file
  if (["A", "E", "I", "O", "U"].includes(letter)) {
    return "data/cutter_table_vowels.json";
  }

  // All other letters get their own file
  return `data/cutter_table_${letter.toLowerCase()}.json`;
}

// Load specific cutter table data based on first letter
async function loadCutterTableForLetter(firstLetter) {
  const filename = getCutterTableFile(firstLetter);

  // Check if already cached
  if (cutterTableCache[filename]) {
    console.log(`Using cached cutter table: ${filename}`);
    return cutterTableCache[filename];
  }

  try {
    const response = await fetch(filename);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Cache the data
    cutterTableCache[filename] = data;

    console.log(
      `Cutter table loaded successfully: ${filename} (${data.length} entries)`
    );
    return data;
  } catch (error) {
    console.error(`Error loading cutter table ${filename}:`, error);
    throw new Error(
      `Failed to load cutter table ${filename}: ${error.message}`
    );
  }
}

// Literature Cutter Functions
function generateDateCutter(year) {
  const centuryMap = {
    15: "A",
    16: "B",
    17: "C",
    18: "D",
    19: "E",
    20: "F",
    21: "G",
  };

  const century = Math.floor(year / 100) + 1;
  const centuryLetter = centuryMap[century] || "G"; // Default to 21st century if out of range
  const yearSuffix = String(year).slice(-2).padStart(2, "0");

  return `${centuryLetter}${yearSuffix}`;
}

async function generateLiteratureCutter(
  workType,
  title,
  editorName,
  publicationYear,
  baseAuthorCutter
) {
  let cutterParts = [];
  let explanation = [];

  switch (workType) {
    case "specific-title":
      // Add cutter based on title
      if (title) {
        const titleCutter = await findCutterNumber(title);
        if (titleCutter && !titleCutter.error) {
          cutterParts.push(titleCutter.cutter);
          explanation.push(
            `Title cutter for "${title}": ${titleCutter.cutter}`
          );
        }
      }
      break;

    case "biography-criticism":
      // Add .Z5 followed by cutter based on editor/author
      cutterParts.push("Z5");
      if (editorName) {
        const editorCutter = await findCutterNumber(editorName);
        if (editorCutter && !editorCutter.error) {
          cutterParts.push(editorCutter.cutter);
          explanation.push(
            `Biography/Criticism: .Z5 + editor cutter for "${editorName}": ${editorCutter.cutter}`
          );
        }
      }
      break;

    case "autobiography-literary":
      // Add .Z5 followed by cutter based on title
      cutterParts.push("Z5");
      if (title) {
        const titleCutter = await findCutterNumber(title);
        if (titleCutter && !titleCutter.error) {
          cutterParts.push(titleCutter.cutter);
          explanation.push(
            `Literary autobiography: .Z5 + title cutter for "${title}": ${titleCutter.cutter}`
          );
        }
      }
      break;

    case "autobiography-nonliterary":
      // Add .A1 after author cutter, no additional cutter
      cutterParts.push("A1");
      explanation.push(
        `Non-literary autobiography: Add .A1 after author cutter`
      );
      break;

    case "collected-essays":
      // Add .A16 followed by cutter based on editor
      cutterParts.push("A16");
      if (editorName) {
        const editorCutter = await findCutterNumber(editorName);
        if (editorCutter && !editorCutter.error) {
          cutterParts.push(editorCutter.cutter);
          explanation.push(
            `Collected Essays: .A16 + editor cutter for "${editorName}": ${editorCutter.cutter}`
          );
        }
      } else if (publicationYear) {
        const dateCutter = generateDateCutter(publicationYear);
        cutterParts.push(dateCutter);
        explanation.push(
          `Collected Essays: .A16 + date cutter for ${publicationYear}: ${dateCutter}`
        );
      }
      break;

    case "collected-poems":
      // Add .A17 followed by cutter based on editor
      cutterParts.push("A17");
      if (editorName) {
        const editorCutter = await findCutterNumber(editorName);
        if (editorCutter && !editorCutter.error) {
          cutterParts.push(editorCutter.cutter);
          explanation.push(
            `Collected Poems: .A17 + editor cutter for "${editorName}": ${editorCutter.cutter}`
          );
        }
      } else if (publicationYear) {
        const dateCutter = generateDateCutter(publicationYear);
        cutterParts.push(dateCutter);
        explanation.push(
          `Collected Poems: .A17 + date cutter for ${publicationYear}: ${dateCutter}`
        );
      }
      break;

    case "collected-novels":
      // Add .A15 followed by cutter based on editor
      cutterParts.push("A15");
      if (editorName) {
        const editorCutter = await findCutterNumber(editorName);
        if (editorCutter && !editorCutter.error) {
          cutterParts.push(editorCutter.cutter);
          explanation.push(
            `Collected Novels/Stories: .A15 + editor cutter for "${editorName}": ${editorCutter.cutter}`
          );
        }
      } else if (publicationYear) {
        const dateCutter = generateDateCutter(publicationYear);
        cutterParts.push(dateCutter);
        explanation.push(
          `Collected Novels/Stories: .A15 + date cutter for ${publicationYear}: ${dateCutter}`
        );
      }
      break;

    case "collected-plays":
      // Add .A19 followed by cutter based on editor
      cutterParts.push("A19");
      if (editorName) {
        const editorCutter = await findCutterNumber(editorName);
        if (editorCutter && !editorCutter.error) {
          cutterParts.push(editorCutter.cutter);
          explanation.push(
            `Collected Plays: .A19 + editor cutter for "${editorName}": ${editorCutter.cutter}`
          );
        }
      } else if (publicationYear) {
        const dateCutter = generateDateCutter(publicationYear);
        cutterParts.push(dateCutter);
        explanation.push(
          `Collected Plays: .A19 + date cutter for ${publicationYear}: ${dateCutter}`
        );
      }
      break;

    case "correspondence":
      // Add .A14 followed by cutter based on editor
      cutterParts.push("A14");
      if (editorName) {
        const editorCutter = await findCutterNumber(editorName);
        if (editorCutter && !editorCutter.error) {
          cutterParts.push(editorCutter.cutter);
          explanation.push(
            `Correspondence/Journals/Diaries: .A14 + editor cutter for "${editorName}": ${editorCutter.cutter}`
          );
        }
      } else if (publicationYear) {
        const dateCutter = generateDateCutter(publicationYear);
        cutterParts.push(dateCutter);
        explanation.push(
          `Correspondence/Journals/Diaries: .A14 + date cutter for ${publicationYear}: ${dateCutter}`
        );
      }
      break;

    case "selected-works":
      // Add .A6 followed by cutter based on editor
      cutterParts.push("A6");
      if (editorName) {
        const editorCutter = await findCutterNumber(editorName);
        if (editorCutter && !editorCutter.error) {
          cutterParts.push(editorCutter.cutter);
          explanation.push(
            `Selected Works: .A6 + editor cutter for "${editorName}": ${editorCutter.cutter}`
          );
        }
      } else if (publicationYear) {
        const dateCutter = generateDateCutter(publicationYear);
        cutterParts.push(dateCutter);
        explanation.push(
          `Selected Works: .A6 + date cutter for ${publicationYear}: ${dateCutter}`
        );
      }
      break;
  }

  return {
    cutterParts,
    explanation,
  };
}

async function findCutterNumber(authorSurname) {
  if (!authorSurname || authorSurname.trim() === "") {
    return null;
  }

  const surname = authorSurname.trim().toLowerCase();
  const firstLetter = surname.charAt(0).toUpperCase();

  // Load the appropriate cutter table for this letter
  let cutterTable;
  try {
    cutterTable = await loadCutterTableForLetter(firstLetter);
  } catch (error) {
    return {
      error: `Failed to load cutter table data: ${error.message}. Please check the console for more details and ensure you have a local server running.`,
      consoleError: error.message,
    };
  }

  // Filter entries by the first letter
  const letterGroup = cutterTable.filter(
    (entry) => entry.group === firstLetter
  );

  if (letterGroup.length === 0) {
    return {
      error: `No entries found for letter "${firstLetter}"`,
    };
  }

  // Sort by name alphabetically
  letterGroup.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  // Find the position where the author would fit
  let selectedEntry = null;
  let explanation = [];
  let matches = [];

  for (let i = 0; i < letterGroup.length; i++) {
    const entry = letterGroup[i];
    const entryName = entry.name
      .toLowerCase()
      .replace(",", "")
      .replace(/[.,].*$/, "");

    matches.push({
      name: entry.name,
      cutter: entry.cutter,
      comparison: surname.localeCompare(entryName),
    });

    if (surname === entryName) {
      // Exact match found
      selectedEntry = entry;
      explanation.push(
        `Exact match found: ${entry.name} (${firstLetter}${entry.cutter})`
      );
      break;
    } else if (surname < entryName) {
      // Author comes before this entry alphabetically
      // Use the previous entry (or this one if it's the first)
      if (i > 0) {
        selectedEntry = letterGroup[i - 1];
        explanation.push(
          `"${authorSurname}" falls between "${
            letterGroup[i - 1].name
          }" and "${entry.name}"`
        );
        explanation.push(
          `Using the entry BEFORE the closest match: ${selectedEntry.name} (${firstLetter}${selectedEntry.cutter})`
        );
      } else {
        selectedEntry = entry;
        explanation.push(
          `"${authorSurname}" comes before all entries, using first entry: ${entry.name} (${firstLetter}${entry.cutter})`
        );
      }
      break;
    }
  }

  // If no match found and surname comes after all entries, use the last entry
  if (!selectedEntry) {
    selectedEntry = letterGroup[letterGroup.length - 1];
    explanation.push(
      `"${authorSurname}" comes after all entries, using last entry: ${selectedEntry.name} (${firstLetter}${selectedEntry.cutter})`
    );
  }

  return {
    cutter: `${firstLetter}${selectedEntry.cutter}`,
    selectedEntry,
    explanation,
    matches: matches.slice(
      Math.max(
        0,
        matches.findIndex((m) => m.name === selectedEntry.name) - 2
      ),
      Math.min(
        matches.length,
        matches.findIndex((m) => m.name === selectedEntry.name) + 3
      )
    ),
  };
}

// Helper function for ordinal numbers
function getOrdinal(num) {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = num % 100;
  return (
    num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
  );
}

// Event Listeners - wrapped in DOM ready check
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, setting up event listeners"); // Debug log
  console.log("All form elements found:", {
    form: !!document.getElementById("cutterForm"),
    itemType: !!document.getElementById("itemType"),
    authorName: !!document.getElementById("authorName"),
    submitBtn: !!document.getElementById("submitBtn"),
  });

  // Item type change handler
  const itemTypeSelect = document.getElementById("itemType");
  if (itemTypeSelect) {
    itemTypeSelect.addEventListener("change", function () {
      const itemType = this.value;
      const authorGroup = document.getElementById("authorGroup");
      const editionGroup = document.getElementById("editionGroup");
      const literatureWorkTypeGroup = document.getElementById(
        "literatureWorkTypeGroup"
      );
      const titleGroup = document.getElementById("titleGroup");
      const editorGroup = document.getElementById("editorGroup");
      const publicationYearGroup = document.getElementById(
        "publicationYearGroup"
      );

      // Hide all optional groups first
      authorGroup.style.display = "none";
      editionGroup.style.display = "none";
      literatureWorkTypeGroup.style.display = "none";
      titleGroup.style.display = "none";
      editorGroup.style.display = "none";
      publicationYearGroup.style.display = "none";

      if (itemType === "standard") {
        authorGroup.style.display = "flex";
        editionGroup.style.display = "flex";
        // Auto-focus on author name
        setTimeout(() => {
          const authorNameInput = document.getElementById("authorName");
          if (authorNameInput) {
            authorNameInput.focus();
          }
        }, 100);
      } else if (
        itemType === "literature-p" ||
        itemType === "autobiography"
      ) {
        authorGroup.style.display = "flex";
        literatureWorkTypeGroup.style.display = "flex";
        setTimeout(() => {
          const authorNameInput = document.getElementById("authorName");
          if (authorNameInput) {
            authorNameInput.focus();
          }
        }, 100);
      }
    });
  }

  // Literature work type change handler
  const literatureWorkTypeSelect =
    document.getElementById("literatureWorkType");
  if (literatureWorkTypeSelect) {
    literatureWorkTypeSelect.addEventListener("change", function () {
      const workType = this.value;
      const titleGroup = document.getElementById("titleGroup");
      const editorGroup = document.getElementById("editorGroup");
      const publicationYearGroup = document.getElementById(
        "publicationYearGroup"
      );

      // Hide all groups first
      titleGroup.style.display = "none";
      editorGroup.style.display = "none";
      publicationYearGroup.style.display = "none";

      switch (workType) {
        case "specific-title":
        case "autobiography-literary":
          titleGroup.style.display = "flex";
          break;
        case "biography-criticism":
          editorGroup.style.display = "flex";
          publicationYearGroup.style.display = "flex";
          break;
        case "autobiography-nonliterary":
          // No additional fields needed
          break;
        case "collected-essays":
        case "collected-poems":
        case "collected-novels":
        case "collected-plays":
        case "correspondence":
        case "selected-works":
          editorGroup.style.display = "flex";
          publicationYearGroup.style.display = "flex";
          break;
      }
    });
  }

  // Form submission handler

  // Form submission handler
  const cutterForm = document.getElementById("cutterForm");
  if (cutterForm) {
    cutterForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      console.log("Form submitted");

      const itemType = document.getElementById("itemType").value;
      const authorName = document.getElementById("authorName").value;
      const edition = document.getElementById("edition").value;
      const resultsSection = document.getElementById("resultsSection");
      const resultContent = document.getElementById("resultContent");

      console.log("Form values:", { itemType, authorName, edition });

      // Show results section
      resultsSection.classList.add("show");

      // Clear previous results
      resultContent.innerHTML = "";

      // Handle different item types
      if (itemType === "literature-p" || itemType === "autobiography") {
        const literatureWorkType =
          document.getElementById("literatureWorkType").value;
        const titleName = document.getElementById("titleName").value;
        const editorName = document.getElementById("editorName").value;
        const publicationYear =
          document.getElementById("publicationYear").value;

        if (!literatureWorkType) {
          resultContent.innerHTML = `
            <div class="result-card error">
              <h3>Error: Missing Work Type</h3>
              <p>Please select the type of work from the dropdown menu.</p>
            </div>
          `;
          return;
        }

        if (!authorName.trim()) {
          resultContent.innerHTML = `
            <div class="result-card error">
              <h3>Error: Missing Author Name</h3>
              <p>Please enter the author's surname to generate a cutter number.</p>
            </div>
          `;
          return;
        }

        try {
          // Get base author cutter
          const baseResult = await findCutterNumber(authorName);
          if (baseResult.error) {
            resultContent.innerHTML = `
              <div class="result-card error">
                <h3>Data Loading Error</h3>
                <p>${baseResult.error}</p>
                ${
                  baseResult.consoleError
                    ? `<p><strong>Technical Details:</strong> ${baseResult.consoleError}</p>`
                    : ""
                }
                <p><strong>Troubleshooting:</strong></p>
                <ul>
                  <li>Make sure you're accessing the application via <code>http://localhost:8000</code> (not file://)</li>
                  <li>Ensure the local HTTP server is running</li>
                  <li>Check that the JSON data files exist in the <code>data/</code> directory</li>
                  <li>Open the browser console (F12) for more technical details</li>
                </ul>
              </div>
            `;
            return;
          }

          // Generate literature-specific cutter
          const literatureResult = await generateLiteratureCutter(
            literatureWorkType,
            titleName,
            editorName,
            publicationYear ? parseInt(publicationYear) : null,
            baseResult.cutter
          );

          // Build final cutter
          let finalCutter = baseResult.cutter;
          if (literatureResult.cutterParts.length > 0) {
            finalCutter += "." + literatureResult.cutterParts.join(".");
          }

          // Build explanation
          let allExplanations = [
            `Author surname: "${authorName}"`,
            `Base author cutter: ${baseResult.cutter}`,
            ...baseResult.explanation,
            ...literatureResult.explanation,
          ];

          // Get work type description
          const workTypeDescriptions = {
            "specific-title": "Specific Title by an Author",
            "biography-criticism": "Biography or Criticism of an Author",
            "autobiography-literary":
              "Autobiography of a Literary Person",
            "autobiography-nonliterary":
              "Autobiography of a Non-Literary Person",
            "collected-essays": "Collected Essays/Prose/Interviews",
            "collected-poems": "Collected Poems",
            "collected-novels": "Collected Novels/Stories",
            "collected-plays": "Collected Plays",
            correspondence: "Correspondence/Journals/Diaries",
            "selected-works": "Selected Works (Plays/Novels/Poems)",
          };

          resultContent.innerHTML = `
            <div class="result-card success">
              <h3>✅ Literature Cutter Number Generated</h3>
              <div class="cutter-result">${finalCutter}</div>
              <p><strong>Work Type:</strong> ${
                workTypeDescriptions[literatureWorkType]
              }</p>
              ${
                titleName
                  ? `<p><strong>Title:</strong> ${titleName}</p>`
                  : ""
              }
              ${
                editorName
                  ? `<p><strong>Editor:</strong> ${editorName}</p>`
                  : ""
              }
              ${
                publicationYear
                  ? `<p><strong>Publication Year:</strong> ${publicationYear}</p>`
                  : ""
              }
              
              <div class="explanation">
                <h4>Step-by-step explanation:</h4>
                <ul class="step-by-step">
                  ${allExplanations
                    .map((exp) => `<li>${exp}</li>`)
                    .join("")}
                </ul>
                <p><strong>Final cutter number:</strong> ${finalCutter}</p>
              </div>
            </div>
          `;
        } catch (error) {
          console.error("Error in literature cutter generation:", error);
          resultContent.innerHTML = `
            <div class="result-card error">
              <h3>Processing Error</h3>
              <p>An error occurred while generating the literature cutter number. Please check the browser console for details.</p>
              <p>Error: ${error.message}</p>
            </div>
          `;
        }
        return;
      }

      if (itemType === "motion-picture") {
        resultContent.innerHTML = `
                      <div class="result-card error">
                          <h3>❌ Motion Picture DVDs / Popular Film/TV Boxsets</h3>
                          <p><strong>DO NOT CLASSIFY - Pass to CS Team</strong></p>
                          <p>These items should not be processed through the standard classification workflow. Please pass them to the Customer Service team for proper handling.</p>
                      </div>
                  `;
        return;
      }

      // Handle standard classification
      if (itemType === "standard") {
        if (!authorName.trim()) {
          resultContent.innerHTML = `
                          <div class="result-card error">
                              <h3>Error: Missing Author Name</h3>
                              <p>Please enter the author's surname to generate a cutter number.</p>
                          </div>
                      `;
          return;
        }

        console.log(
          "Processing standard classification for:",
          authorName
        );

        try {
          const result = await findCutterNumber(authorName);
          console.log("Cutter result:", result);

          if (result.error) {
            resultContent.innerHTML = `
                              <div class="result-card error">
                                  <h3>Data Loading Error</h3>
                                  <p>${result.error}</p>
                                  ${
                                    result.consoleError
                                      ? `<p><strong>Technical Details:</strong> ${result.consoleError}</p>`
                                      : ""
                                  }
                                  <p><strong>Troubleshooting:</strong></p>
                                  <ul>
                                    <li>Make sure you're accessing the application via <code>http://localhost:8000</code> (not file://)</li>
                                    <li>Ensure the local HTTP server is running</li>
                                    <li>Check that the JSON data files exist in the <code>data/</code> directory</li>
                                    <li>Open the browser console (F12) for more technical details</li>
                                  </ul>
                              </div>
                          `;
            return;
          }

          let finalCutter = result.cutter;
          let steps = [
            `Author surname: "${authorName}"`,
            `First letter: "${result.cutter.charAt(0)}"`,
            `Located in ${result.cutter.charAt(
              0
            )} section of cutter table`,
            `Found position in alphabetical sequence`,
          ];

          // Add edition number if applicable
          if (edition) {
            finalCutter += `.${edition}`;
            steps.push(
              `Added edition number: .${edition} (for ${getOrdinal(
                edition
              )} edition)`
            );
          }

          steps.push(`Final cutter number: ${finalCutter}`);

          // Create matches table
          const matchesTable = result.matches
            .map((match) => {
              const isSelected = match.name === result.selectedEntry.name;
              return `<tr class="${isSelected ? "selected" : ""}">
                                  <td>${match.name}</td>
                                  <td>${result.cutter.charAt(0)}${
                match.cutter
              }</td>
                                  <td>${
                                    isSelected ? "← SELECTED" : ""
                                  }</td>
                              </tr>`;
            })
            .join("");

          resultContent.innerHTML = `
                          <div class="result-card success">
                              <h3>✅ Cutter Number Generated Successfully</h3>
                              <div class="cutter-result">${finalCutter}</div>
                              <p><strong>Author:</strong> ${authorName}</p>
                              ${
                                edition
                                  ? `<p><strong>Edition:</strong> ${getOrdinal(
                                      edition
                                    )} edition</p>`
                                  : ""
                              }
                              
                              <div class="explanation">
                                  <h4>Step-by-Step Process:</h4>
                                  <ul class="step-by-step">
                                      ${steps
                                        .map((step) => `<li>${step}</li>`)
                                        .join("")}
                                  </ul>
                              </div>

                              <div class="explanation">
                                  <h4>Alphabetical Position Analysis:</h4>
                                  <p>${result.explanation.join(" ")}</p>
                                  
                                  <table class="matches-table">
                                      <thead>
                                          <tr>
                                              <th>Table Entry</th>
                                              <th>Cutter Number</th>
                                              <th>Selection Status</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          ${matchesTable}
                                      </tbody>
                                  </table>
                              </div>

                              <div class="explanation">
                                  <h4>⚠️ Critical Workflow Rule Applied:</h4>
                                  <p><strong>Always use the entry BEFORE the closest alphabetical match.</strong> This ensures proper shelving order and prevents conflicts with existing classifications.</p>
                              </div>
                          </div>
                      `;
        } catch (error) {
          console.error("Error in cutter generation:", error);
          resultContent.innerHTML = `
                          <div class="result-card error">
                              <h3>Processing Error</h3>
                              <p>An error occurred while generating the cutter number. Please check the browser console for details.</p>
                              <p>Error: ${error.message}</p>
                          </div>
                      `;
        }
      } else {
        resultContent.innerHTML = `
                      <div class="result-card error">
                          <h3>Please Select Item Type</h3>
                          <p>Please select an item type from the dropdown menu.</p>
                      </div>
                  `;
      }
    });
  }

  // Backup click handler for the submit button
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Button clicked directly"); // Debug log
      if (cutterForm) {
        cutterForm.dispatchEvent(
          new Event("submit", { cancelable: true })
        );
      }
    });
  }

  // Add live search functionality
  const authorNameInput = document.getElementById("authorName");
  if (authorNameInput) {
    authorNameInput.addEventListener("input", function () {
      const value = this.value.trim();
      if (value.length >= 2) {
        // Could add live preview here if desired
      }
    });
  }
});

// Add keyboard shortcuts (outside DOM ready as it applies to document)
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "Enter") {
    const form = document.getElementById("cutterForm");
    if (form) {
      form.dispatchEvent(new Event("submit"));
    }
  }
});

// Add live search functionality
document
  .getElementById("authorName")
  .addEventListener("input", function () {
    const value = this.value.trim();
    if (value.length >= 2) {
      // Could add live preview here if desired
    }
  });

// Add keyboard shortcuts
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "Enter") {
    document
      .getElementById("cutterForm")
      .dispatchEvent(new Event("submit"));
  }
});

// Auto-focus on author name when standard classification is selected
document
  .getElementById("itemType")
  .addEventListener("change", function () {
    if (this.value === "standard") {
      setTimeout(() => {
        document.getElementById("authorName").focus();
      }, 100);
    }
  });
