import QRCode from "react-qr-code";

const QRCodeDisplay = ({ value, size = 120 }) => {
    return (
        <div className="bg-white p-2 rounded-xl shadow-sm inline-block">
            <QRCode 
                value={value}
                size={size}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="M"
            />
        </div>
    );
};

export default QRCodeDisplay;
