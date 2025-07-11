import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'Garg Assistant';

const config = {
  botName,
  initialMessages: [
    createChatBotMessage(`Hi! I'm your assistant. How can I help you today?`, {
      widget: 'mainOptions',
    }),
  ],
  widgets: [
    {
      widgetName: 'mainOptions',
      widgetFunc: (props) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => props.actionProvider.handleOrderGuide()} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, marginBottom: 4 }}>How to order?</button>
          <button onClick={() => props.actionProvider.handleTrackOrder()} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, marginBottom: 4 }}>Track my order</button>
          <button onClick={() => props.actionProvider.handleReturnPolicy()} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, marginBottom: 4 }}>Return & Refund Policy</button>
          <button onClick={() => props.actionProvider.handleContactSupport()} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, marginBottom: 4 }}>Contact Support</button>
          <button onClick={() => props.actionProvider.handleOther()} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600 }}>Other</button>
        </div>
      ),
    },
    {
      widgetName: 'otherInput',
      widgetFunc: (props) => (
        <form onSubmit={props.actionProvider.handleOtherSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          <input
            type="text"
            value={props.state.otherQuery || ''}
            onChange={e => props.setState(state => ({ ...state, otherQuery: e.target.value }))}
            placeholder="Enter your query..."
            style={{ padding: '10px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem' }}
            required
          />
          <button type="submit" style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600 }}>Send</button>
        </form>
      ),
    },
  ],
};

export default config; 