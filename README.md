# Architectural Image Database

A tagged dataset of architectural photographs, built in Professor David Kirsh's XR Lab at UC San Diego (Spring 2025). It powers the image search tool here: [https://soren4k.github.io/arch-explorer/](https://soren4k.github.io/arch-explorer/)

The whole dataset is one file, `googlemedia\_data.json` (about 36 MB). It holds two things:

1. **The tag taxonomy**: every tag the AI tagger was allowed to use, organised into categories.

2. **The image records**: one entry per image, with its source URL, the architect, and the AI-generated tags with confidence scores.

The image files themselves are not in this repository. Each record points to the image's public URL, which is what the search tool displays.

## At a glance

|  |  |
| - | - |
| Images | 25,000+ |
| Tags in the taxonomy | 161 |
| Taxonomy categories | 10 (21 subcategories) |
| Image sources | Wikimedia Commons, Google Search, Bing |
| Tagging model | \[Gemini 1.5 Flash] |


## File structure

```
\{  
  "taxonomy\_transformed": \[ ...10 categories... \],  
  "images": \[ ...one record per image... \]  
\}
```

### `taxonomy\_transformed`

A list of categories. Each category has subcategories, and each subcategory has a list of tags. The hierarchy is three levels deep: category → subcategory → tag.

```
\{  
  "category": "Material Properties",  
  "subCategories": \[  
    \{  
      "name": "Primary Material Type",  
      "tags": \["Concrete", "Brick", "Stone", "Wood", "Glass", "..."\]  
    \}  
  \]  
\}
```

The ten categories:

| Category | Subcategories | Tags |
| - | - | - |
| View & Space Type | Primary View; Interior Space Type; Exterior Space Type | 28 |
| Spatial Configuration | Scale & Proportion; Layout & Circulation Elements | 9 |
| Environmental Conditions | Lighting & Daylight | 10 |
| Material Properties | Primary Material Type; Finish & Appearance; Color Characteristics | 26 |
| Architectural Elements | Openings; Structural Elements; Decorative Elements; Roof Form | 20 |
| Form & Geometry | Overall Form; Surface Characteristics; Pattern & Repetition | 14 |
| Architectural Styles | Identifiable Styles | 21 |
| Site & Context | Geographic Setting; Immediate Surroundings | 11 |
| Building Type / Function | Primary Function | 17 |
| Building Condition | Current Condition | 5 |


### `images`

A list with one record per image. Example:

```
\{  
  "architect": "Frank Lloyd Wright",  
  "architect\_birth\_year": "1867",  
  "architect\_death\_year": "1959",  
  "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Interior%2C\_Duncan\_House%2C\_Polymath\_Park%2C\_Acme%2C\_PA.jpg",  
  "width": "4032",  
  "height": "3024",  
  "local\_path": "/Volumes/.../wiki\_Interior\_Duncan\_House\_Polymath\_Park\_Acme\_PA.jpg",  
  "dataset\_source": "wiki",  
  "original\_filename": "Interior\_Duncan\_House\_Polymath\_Park\_Acme\_PA.jpg",  
  "ai\_building\_name": "unknown",  
  "ai\_building\_name\_confidence": "0.0",  
  "ai\_completion\_date": "unknown",  
  "ai\_completion\_date\_confidence": "0.0",  
  "ai\_city": "unknown",  
  "ai\_city\_confidence": "0.0",  
  "ai\_country": "unknown",  
  "ai\_country\_confidence": "0.0",  
  "ai\_visual\_tags": "\[\{\\"tag\\": \\"Interior View\\", \\"confidence\\": 1.0\}, \{\\"tag\\": \\"Living Room\\", \\"confidence\\": 1.0\}, \{\\"tag\\": \\"Wood\\", \\"confidence\\": 0.9\}\]"  
\}
```

| Field | What it holds |
| - | - |
| `architect` | The architect the image was collected under. |
| `architect\_birth\_year`, `architect\_death\_year` | The architect's dates. |
| `imageUrl` | Public URL of the image. The search tool loads images from here. |
| `width`, `height` | Image size in pixels. |
| `dataset\_source` | Where the image was collected from: for example `wiki` for Wikimedia Commons. |
| `original\_filename` | The file's name at the source. |
| `local\_path` | Where the file sat on my drive during collection. Not usable by anyone else; kept for traceability. |
| `ai\_building\_name`, `ai\_completion\_date`, `ai\_city`, `ai\_country` | The model's best identification of the building. `"unknown"` when it could not tell. |
| `...\_confidence` | The model's confidence in each identification, from 0.0 to 1.0. |
| `ai\_visual\_tags` | The visual tags the model assigned, each with a confidence from 0.0 to 1.0. |


## Things to know before using the data

- **Every value is stored as text.** Years, pixel sizes and confidence scores are strings (`"1867"`, `"0.0"`), so convert them to numbers before comparing or sorting.

- **`ai\_visual\_tags` is a JSON list stored as a string.** It needs a second parse; see the example below.

- **Tags and confidences are model output.** They were not checked by hand image by image. The confidence score is the model's own estimate, and the search tool uses it to rank and filter results.

- **Image URLs can stop working.** The dataset stores links, so an image disappears from the tool if its source page is taken down.

- **A few tags may not match the taxonomy word for word.** For example, one record uses `High Volume` where the taxonomy tag is `Tall Ceiling / High Volume`.

## Loading it in Python

```
import json  
  
with open("googlemedia\_data.json") as f:  
    data = json.load(f)  
  
taxonomy = data\["taxonomy\_transformed"\]  
images = data\["images"\]  
  
\# Tags for the first image, as a list of \{"tag", "confidence"\} entries  
tags = json.loads(images\[0\]\["ai\_visual\_tags"\])  
  
\# All images tagged "Brutalist" with confidence of at least 0.8  
brutalist = \[  
    img for img in images  
    if any(t\["tag"\] == "Brutalist" and t\["confidence"\] \>= 0.8  
           for t in json.loads(img\["ai\_visual\_tags"\]))  
\]
```

## What's in this repository

| File | What it is |
| - | - |
| `googlemedia\_data.json` | The dataset described above. |
| `app.jsx` | The search tool's code (React). It loads the dataset and handles filtering. |
| `index.html` | The page that loads the app. |
| `.nojekyll` | A settings file for GitHub Pages, which hosts the tool. |


## How it was built

1. **Collection.** Images were gathered per architect through the Wikimedia, Google Search and Bing APIs.

2. **Taxonomy.** The tag list was designed first, so the model chose from a fixed vocabulary instead of inventing tags.

3. **Tagging.** Each image was sent to the model with the taxonomy. The model returned tags and a confidence score for each.

4. **Search tool.** The GUI reads this file directly and filters images by tag and confidence.
