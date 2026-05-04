import * as React from 'react'

interface QuoteReceivedEmailProps {
  name: string
}

export const QuoteReceivedEmail: React.FC<QuoteReceivedEmailProps> = ({ name }) => (
  <html lang="es">
    <body style={{ backgroundColor: '#FDFAF5', color: '#2C1A0E', fontFamily: '"DM Sans", Arial, sans-serif', margin: 0, padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '8px', border: '1px solid #E5E5E5', textAlign: 'center' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', color: '#2C1A0E', fontSize: '24px', marginBottom: '20px' }}>
          ¡Hemos recibido tu solicitud de cotización!
        </h1>
        <p style={{ color: '#8A8070', marginBottom: '20px', lineHeight: '1.6' }}>
          Hola <strong>{name}</strong>,
        </p>
        <p style={{ color: '#8A8070', marginBottom: '30px', lineHeight: '1.6' }}>
          Gracias por pensar en MaderArte para tu proyecto. Hemos recibido los detalles de tu cotización y uno de nuestros expertos en diseño se pondrá en contacto contigo en las próximas 48 horas con una propuesta personalizada.
        </p>
        
        <div style={{ padding: '20px', backgroundColor: '#FDFAF5', borderRadius: '6px', borderLeft: '4px solid #B8935A', textAlign: 'left', marginBottom: '30px' }}>
          <p style={{ margin: 0, color: '#8A8070', fontStyle: 'italic' }}>
            &quot;Cada espacio merece ser único. Estamos emocionados de trabajar contigo para crear la pieza perfecta.&quot;
          </p>
        </div>

        <p style={{ color: '#8A8070', fontSize: '14px', marginBottom: '40px' }}>
          Si tienes alguna pregunta adicional, puedes responder directamente a este correo.
        </p>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #E5E5E5', textAlign: 'center', fontSize: '12px', color: '#8A8070' }}>
          <p>MaderArte Mueblería Premium - Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
  </html>
)

export default QuoteReceivedEmail
