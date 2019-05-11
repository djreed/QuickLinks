const ANCHOR_TAG = "a"
const HREF_ATTR = "href"

function walk(node) {
	// Stolen shamelessly from:
	// http://is.gd/mwZp7E
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
      handleElement(node);
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;
	}
}

function handleElement(node) {
  if (node.tagName.toLowerCase() == ANCHOR_TAG) {
    handleAnchor(node)
  }
}

function handleAnchor(node) {
  console.log("Link tag found: " + node.getAttribute(HREF_ATTR))
}

walk(document.body);
