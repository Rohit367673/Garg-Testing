class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  handleOrderGuide() {
    const msg = this.createChatBotMessage(
      "To place an order: 1) Browse products, 2) Select size/color, 3) Click 'Add to Cart', 4) Go to Cart and proceed to checkout."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
  }

  handleTrackOrder() {
    const msg = this.createChatBotMessage(
      "To track your order, log in and go to 'My Orders' in your account. You'll see the status and tracking info."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
  }

  handleReturnPolicy() {
    const msg = this.createChatBotMessage(
      "You can request a return within 7 days of delivery. Visit 'My Orders', select the order, and click 'Request Return'. Refunds are processed after the product is received back."
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
  }

  handleContactSupport() {
    const msg = this.createChatBotMessage(
      "For support, use the Contact page or email us at gargexclusive@gmail.com. We're here to help!"
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
  }

  handleOther() {
    this.setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        this.createChatBotMessage("Please enter your query below:", { widget: 'otherInput' })
      ],
      otherQuery: '',
    }));
  }

  async handleOtherSubmit(e) {
    e.preventDefault();
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, this.createClientMessage(prev.otherQuery)] }));
    // Send to backend API
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Chatbot User',
          email: 'no-reply@gargexclusive.com',
          subject: 'Chatbot Query',
          description: this.state.otherQuery,
        }),
      });
      this.setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          this.createChatBotMessage('Your query has been sent to the owner. Thank you!'),
        ],
        otherQuery: '',
      }));
    } catch (err) {
      this.setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          this.createChatBotMessage('There was an error sending your query. Please try again later.'),
        ],
        otherQuery: '',
      }));
    }
  }
}

export default ActionProvider; 