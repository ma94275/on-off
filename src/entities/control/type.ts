export default interface ControlProps {
  number: number;
  title: string;
  description: string;
  isOn: boolean;
  onClick: () => void;
}
