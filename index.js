const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

const LICENSE_TEMPLATE = `# Moral use Public License (MuPL) v1.0

## Preamble

This licence is designed to ensure that software remains free and open whilst promoting moral practices and preventing use by entities that may conflict with moral values.

## Terms and Conditions

### 1. Definitions

- **"This Licence"** refers to the Moral Use Public Licence v1.0.
- **"The Program"** refers to any copyrightable work licensed under this Licence, specifically "{{PROJECT_NAME}}".
- **"You"** refers to the licensee, whether an individual or organisation.
- **"Modify"** means to copy from or adapt all or part of the work.
- **"Distribution"** includes making the Program available to others through any means, including but not limited to: providing access over a network, offering as a service, or any form of public availability.
- **"Derivative Work"** means any work based upon the Program or a portion thereof.
- **"Employee"** includes all full-time, part-time, contract, and temporary workers.
- **"Compensation"** includes all forms of remuneration: salary, wages, bonuses, stock options, benefits, and other consideration.
- **"Module Use"** means using the Program as a discrete library or module within a larger work without modification to the Program itself.

### 2. Grant of Rights

Subject to the terms and conditions of this Licence, You are granted a worldwide, royalty-free, non-exclusive licence to use, copy, modify, and distribute the Program and Derivative Works, provided You comply with all conditions herein.

### 3. Eligibility Restrictions

This Licence is NOT granted to:

a) **Organisations with excessive compensation disparity**: Any entity where the ratio between the highest and lowest compensated employees exceeds 50:1 based on total annual compensation.

b) **Large organisations**: Any entity with more than 1,000 employees globally, including all subsidiaries, affiliates, and contracted workers.

c) **Military entities**: Any military organisation, defence contractor, or entity primarily engaged in developing military applications or weapons systems.

d) **Parent/subsidiary circumvention**: Any subsidiary, affiliate, or related entity of an organisation that would be restricted under clauses (a), (b), or (c) above.

### 4. Copyleft Provisions

Any Distribution of the Program or Derivative Works, including making them available over a network or as a service, constitutes distribution under this Licence and requires:

a) **Source code availability**: Complete source code must be made available under this Licence to all users who can access the Program or service.

b) **Same licence terms**: All Derivative Works must be licensed under this Licence.

c) **Proper attribution**: Original authorship must be clearly attributed and preserved.

d) **Licence inclusion**: This Licence text must be included with all distributions, a link to your licence text will suffice.

### 5. Network Use and Services

If You run a modified version of the Program on a server or provide it as a service accessible to others over a network, You must:

a) Make the complete source code of Your version available for download at no charge
b) Provide clear instructions for obtaining the source code
c) Ensure the source code remains available for the entire time your service is accessible

### 6. Module and Library Exception

Notwithstanding the licence compatibility restrictions in Section 10, the Program may be used as a Module within a larger work that is licensed under an incompatible licence, provided that:

a) The Program is used without modification as a discrete module or library
b) The Program's original licence and copyright notices are preserved
c) The source code of the Program remains available under this Licence
d) Clear attribution is given to the Program and its licence within the documentation or licence notices of the larger work
e) The interface between the Program and the larger work is through well-defined module boundaries (such as API calls, library imports, or similar mechanisms)

This exception does not permit:

- Modification of the Program itself
- Static linking or compilation that would create a single combined executable
- Any form of integration that would constitute creating a Derivative Work of the Program

### 7. Compliance and Verification

Organisations using this Licence must allow verification of compliance upon reasonable request.

### 8. Liability and Warranty

THE PROGRAM IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY ARISING FROM THE USE OF THE PROGRAM.

### 9. Termination

This Licence terminates automatically if You fail to comply with any of its terms. Upon termination, You must immediately cease all use and distribution of the Program and destroy all copies.

### 10. Interpretation

- This Licence shall be interpreted under the laws of {{JURISDICTION}}
- If any provision is deemed unenforceable, the remainder of the Licence remains in effect
- The original English version of this Licence is the authoritative version

### 11. Licence Compatibility

This Licence is intentionally incompatible with licences that do not include similar moral use restrictions. Combining this Program with code under incompatible licences is not permitted, except as specifically allowed under Section 6 (Module and Library Exception).

---

**Copyright {{YEAR}} {{HOLDER}}**

This work is licensed under the Moral Use Public Licence v1.0. To view a copy of this licence, visit {{LICENSE_URL}}{{CONTACT}}.

---
`;

function generateLicense(params) {
    const {
        name = "this software",
        holder = "[Copyright Holder]",
        year = new Date().getFullYear().toString(),
        owner = holder,
        contact = "",
        jurisdiction = "the United Kingdom",
        licenseUrl = "https://mupl.itoj.dev",
    } = params;

    return LICENSE_TEMPLATE.replace(/\{\{PROJECT_NAME\}\}/g, name)
        .replace(/\{\{HOLDER\}\}/g, holder)
        .replace(/\{\{YEAR\}\}/g, year)
        .replace(/\{\{OWNER\}\}/g, owner)
        .replace(/\{\{CONTACT\}\}/g, contact)
        .replace(/\{\{JURISDICTION\}\}/g, jurisdiction)
        .replace(/\{\{LICENSE_URL\}\}/g, licenseUrl);
}

function markdownToHtml(markdown) {
    return markdown
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/^\*\*(.*)\*\*/gm, "<strong>$1</strong>")
        .replace(/^\*(.*)\*/gm, "<em>$1</em>")
        .replace(/^- (.*$)/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
        .replace(/^([a-z]\) .*$)/gm, "<li>$1</li>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/^(.*)$/gm, "<p>$1</p>")
        .replace(/<p><h/g, "<h")
        .replace(/<\/h([1-6])><\/p>/g, "</h$1>")
        .replace(/<p><ul>/g, "<ul>")
        .replace(/<\/ul><\/p>/g, "</ul>")
        .replace(/<p><li>/g, "<li>")
        .replace(/<\/li><\/p>/g, "</li>");
}

function markdownToPlaintext(markdown) {
    return markdown
        .replace(/^#{1,6} /gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .trim();
}

function formatLicense(licenseText, format) {
    switch (format.toLowerCase()) {
        case "html":
            return {
                content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moral Use Public License v1.0</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3 { color: #2c3e50; }
        h1 { border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
        code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .copyright { 
            background: #ecf0f1; 
            padding: 15px; 
            border-left: 4px solid #3498db; 
            margin: 20px 0;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="warning">
        <strong>⚠️ Important:</strong> This is a custom license with specific restrictions on business use. 
        Please read all terms carefully before using this software.
    </div>
    ${markdownToHtml(licenseText)}
</body>
</html>`,
                contentType: "text/html",
            };
        case "markdown":
        case "md":
            return {
                content: licenseText,
                contentType: "text/markdown",
            };
        case "text":
        case "txt":
        case "plain":
            return {
                content: markdownToPlaintext(licenseText),
                contentType: "text/plain",
            };
        case "json":
            return {
                content: JSON.stringify(
                    {
                        license: "MuPL-1.0",
                        name: "Moral Use Public License v1.0",
                        text: licenseText,
                        format: "markdown",
                    },
                    null,
                    2
                ),
                contentType: "application/json",
            };
        default:
            return {
                content: licenseText,
                contentType: "text/markdown",
            };
    }
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
    return;
});

app.get("/license", (req, res) => {
    const licenseText = generateLicense(req.query);
    const formatted = formatLicense(licenseText, req.query["format"]);

    res.set("Content-Type", formatted.contentType);
    res.send(formatted.content);
});

app.post("/generate", (req, res) => {
    const {
        name,
        holder,
        year,
        owner,
        contact,
        jurisdiction,
        format = "html",
    } = req.body;

    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (holder) params.append("holder", holder);
    if (year) params.append("year", year);
    if (owner && owner !== holder) params.append("owner", owner);
    if (contact) params.append("contact", contact);
    if (jurisdiction) params.append("jurisdiction", jurisdiction);

    const url = `${req.protocol}://${req.get(
        "host"
    )}/license?${params.toString()}`;

    res.json({
        success: true,
        url: url,
        shortUrl: `/?${params.toString()}`,
        formats: {
            html: url + "&format=html",
            markdown: url + "&format=markdown",
            text: url + "&format=text",
            json: url + "&format=json",
        },
    });
});

app.get("/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use(express.static("./favicon"));

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`MuPL License Server running on port ${PORT}`);
    console.log(
        `Visit http://localhost:${PORT} to access the license generator`
    );
});

module.exports = app;
