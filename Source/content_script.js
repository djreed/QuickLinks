const ELEMENT = 1;
const DOCUMENT = 9;
const DOCUMENT_FRAGMENT = 11;

function walk(domNode, predicate, action) {
  var child, next;

  if (predicate(domNode)) {
    action(domNode)
  }

  switch (domNode.nodeType) {
    case ELEMENT:
    case DOCUMENT:  // Document
    case DOCUMENT_FRAGMENT: // Document fragment
      child = domNode.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child, predicate, action);
        child = next;
      }
      break;
  }
}

const ANCHOR_TAG = "a";
const HREF_ATTR = "href";

function detectAnchorElement(domNode) {
  return domNode.nodeType === ELEMENT &&
    domNode.tagName.toLowerCase() === ANCHOR_TAG;
}

const LINK_TOGGLE_DELAY_MAX = 1000;
const LINK_OFF_DURATION = 100;
const LINK_ON_DURATION = 900;

function toggleLink(nodeWrapper) {
  if (nodeWrapper.domNode.getAttribute(HREF_ATTR) === nodeWrapper.originalLink) {
    nodeWrapper.domNode.setAttribute(HREF_ATTR, "javascript:void(0)");
    return false;
  } else {
    nodeWrapper.domNode.setAttribute(HREF_ATTR, nodeWrapper.originalLink);
    return true;
  }
}

function toggleLinkRepeater(nodeWrapper) {
  return () => {
    var linkActivated = toggleLink(nodeWrapper);
    if (linkActivated) {
      setTimeout(toggleLinkRepeater(nodeWrapper), LINK_ON_DURATION);
    } else {
      setTimeout(toggleLinkRepeater(nodeWrapper), LINK_OFF_DURATION);
    }
  }
}

function startAnchorToggle(domNode) {
  const nodeWrapper = {
    domNode: domNode,
    originalLink: domNode.getAttribute(HREF_ATTR),
  };
  if (nodeWrapper.originalLink != "javascript:void(0)") {
    toggleLinkRepeater(nodeWrapper)();
  }
}

function queueTimers(node) {
  walk(node, detectAnchorElement, startAnchorToggle);
}

function addedNodeObserver(mutations) {
  var i, node;

  mutations.forEach(function(mutation) {
    for (i = 0; i < mutation.addedNodes.length; i++) {
      node = mutation.addedNodes[i];
      queueTimers(node);
    }
  });
}

function run(rootNode) {
  var observerConfig = {
    characterData: true,
    childList: true,
    subtree: true
  };

  var bodyObserver = new MutationObserver(addedNodeObserver);
  bodyObserver.observe(rootNode, observerConfig);

  queueTimers(rootNode);
}

run(document.body);
