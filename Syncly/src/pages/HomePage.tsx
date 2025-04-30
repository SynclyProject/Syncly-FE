import Input from "../shared/ui/Input";

const HomePage = () => {
  return (
    <div>
      Homepage
      <Input
        title="Email"
        placeholder="Enter your email address... "
        state="default"
      />
      <Input
        title="Email"
        placeholder="Enter your email address... "
        state="success"
      />
      <Input
        title="Email"
        placeholder="Enter your email address... "
        state="failed"
      />
    </div>
  );
};

export default HomePage;
