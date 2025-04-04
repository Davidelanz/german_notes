const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

// Directory where your markdown files are stored
const markdownDirectory = "topics";

// Path to the template HTML file
const templatePath = "template.html";
const outputPath = "docs/index.html";

// Function to generate the HTML accordion content from the markdown file
function generateAccordionContent(filename, sectionId) {
  const markdownPath = path.join(markdownDirectory, filename);
  const markdownContent = fs.readFileSync(markdownPath, "utf-8");

  // Extract the first H1 heading (title)
  const h1Match = markdownContent.match(/^# (.+)$/m); // Match the first # heading
  const sectionTitle = h1Match ? h1Match[1] : sectionId; // Default to sectionId if no h1 is found

  // Use marked to convert markdown to HTML (exclude the first h1 from markdown content)
  const markdownWithoutH1 = markdownContent.replace(/^# .+/m, ""); // Remove the first # heading (h1)
  const htmlContent = marked(markdownWithoutH1);

  // Define accordion item template with dynamic content
  const accordionHtml = `
    <div class="accordion-item">
        <h2 class="accordion-header" id="heading${sectionId}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${sectionId}" aria-expanded="true" aria-controls="collapse${sectionId}">
                ${sectionId} ${sectionTitle} <!-- Use dynamic title from H1 and sectionId -->
            </button>
        </h2>
        <div id="collapse${sectionId}" class="accordion-collapse collapse show" aria-labelledby="heading${sectionId}" data-bs-parent="#accordionA1.1">
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

  // Sample markdown filenames and section IDs to map them
  const sections = [
    { filename: "A1.1_verbkonjugationimpraesens.md", sectionId: "A1.1 (6)" },
    // { filename: "A1.2_verbkonjugationimperfekt.md", sectionId: "A1.2.1" },
    // Add more sections here as needed
  ];

  // Generate the accordion content for all sections
  const accordionContent = sections
    .map((section) =>
      generateAccordionContent(section.filename, section.sectionId),
    )
    .join("");

  // Wrap the generated accordion items in a div with the accordion class
  const accordionWrapper = `
    <div class="accordion" id="accordionA1.1">
        ${accordionContent}
    </div>`;

  // Insert the accordion wrapper into the template (where the dynamic content placeholder is)
  const finalHtml = templateHtml.replace(
    "{{dynamic_content}}",
    accordionWrapper,
  );

  // Write the final HTML to output/index.html
  fs.writeFileSync(outputPath, finalHtml);
  console.log("HTML file has been generated at", outputPath);
}

// Run the build process
buildHTML();
