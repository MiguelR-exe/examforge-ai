import Button from "../common/Button";

export default function UploadButton({ onClick, loading, disabled, children = "Subir documento" }) {
  return (
    <Button onClick={onClick} loading={loading} disabled={disabled} className="w-full justify-center">
      {children}
    </Button>
  );
}