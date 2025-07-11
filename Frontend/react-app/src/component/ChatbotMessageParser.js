class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase();
    if (lower.includes('order') && lower.includes('how')) {
      this.actionProvider.handleOrderGuide();
    } else if (lower.includes('track')) {
      this.actionProvider.handleTrackOrder();
    } else if (lower.includes('return') || lower.includes('refund')) {
      this.actionProvider.handleReturnPolicy();
    } else if (lower.includes('contact') || lower.includes('support') || lower.includes('help')) {
      this.actionProvider.handleContactSupport();
    } else {
      this.actionProvider.handleContactSupport();
    }
  }
}

export default MessageParser; 