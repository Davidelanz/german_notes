const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const templatePath = "template.html";
const outputPath = "docs/index.html";
const markdownDirectory = "topics";

const markdownTopics = {
  "A1.1 (Anfänger - Grundlegende Einführungen und Alltagsleben)": [
    { filename: "A1.1_verbkonjugationimpraesens.md" },
  ],
};

// Function to generate the HTML accordion content from the markdown file
function generateAccordionContent(filename) {
  const markdownPath = path.join(markdownDirectory, filename);
  const markdownContent = fs.readFileSync(markdownPath, "utf-8");

  // Extract the first H1 heading (title)
  const h1Match = markdownContent.match(/^# (.+)$/m); // Match the first # heading
  const sectionTitle = h1Match ? h1Match[1] : "TITLE MISSING"; // Default if no h1 is found

  // Use marked to convert markdown to HTML (exclude the first h1 from markdown content)
  const markdownWithoutH1 = markdownContent.replace(/^# .+/m, "");
  const htmlContent = marked(markdownWithoutH1);

  // Define accordion item template with dynamic content
  const accordionHtml = `
    <div class="accordion-item">
        <h2 class="accordion-header" id="heading${filename}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${filename}" aria-expanded="true" aria-controls="collapse${filename}">
              ${sectionTitle}
            </button>
        </h2>
        <div id="collapse${filename}" class="accordion-collapse collapse show" aria-labelledby="heading${filename}" data-bs-parent="#accordion${filename}">
            <div class="accordion-body" style="font-family: 'Helvetica Neue', sans-serif;">
                ${htmlContent}
            </div>
        </div>
    </div>`;

  return accordionHtml;
}

// Function to read the template and insert the generated content
function buildHTML() {
  // Read the template HTML
  const templateHtml = fs.readFileSync(templatePath, "utf-8");

  // Generate content for all sections
  let finalContent = "";

  // Loop over each topic section in the markdownTopics object
  Object.keys(markdownTopics).forEach((sectionTitle) => {
    const sectionContent = markdownTopics[sectionTitle]
      .map((section) =>
        generateAccordionContent(section.filename, section.sectionTitle),
      )
      .join(""); // Create the accordion content for each section

    // Wrap the content in an <h2>
    finalContent += `
      <h2 class="mt-5 mb-3">${sectionTitle}</h2>
      <div class="accordion">
        ${sectionContent}
      </div>
    `;
  });

  // Insert the generated content into the template
  const finalHtml = templateHtml.replace("{{dynamic_content}}", finalContent);

  // Write the final HTML to output/index.html
  fs.writeFileSync(outputPath, finalHtml);
  console.log("HTML file has been generated at", outputPath);
}

// Run the build process
buildHTML();
