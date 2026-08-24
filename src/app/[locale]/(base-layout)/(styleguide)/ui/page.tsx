import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import InputSlot from '@/components/ui/InputSlot';
import Radio from '@/components/ui/Radio';
import Toggle from '@/components/ui/Toggle';

export const metadata = { title: 'UI | Styleguide' };

/*
 * The primitives, in the states worth looking at. Everything except Button is a
 * server component built on a native input, so the controls on this page work
 * with JavaScript disabled: check one, submit the form, see it in the URL.
 */

const arrowIcon = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path fill="currentColor" d="M6 3l5 5-5 5-1.1-1.1L8.8 8 4.9 4.1 6 3Z" />
  </svg>
);

export default function UiPage() {
  return (
    <>
      <h1>UI</h1>

      <section>
        <h2>Button</h2>
        <div className="styleguide-samples">
          <Button>Fill</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="styleguide-samples">
          <Button size="small">Small</Button>
          <Button size="small" variant="outline">
            Small outline
          </Button>
          <Button rightIcon={arrowIcon}>With icon</Button>
          <Button iconOnly leftIcon={arrowIcon} aria-label="Next" />
          <Button iconOnly size="small" variant="outline" leftIcon={arrowIcon} aria-label="Next" />
        </div>
      </section>

      <section>
        <h2>Checkbox</h2>
        <div className="styleguide-stack">
          <Checkbox label="Unchecked" name="demo-checkbox" value="one" />
          <Checkbox label="Checked by default" name="demo-checkbox" value="two" defaultChecked />
          <Checkbox label="Disabled" name="demo-checkbox" value="three" disabled />
          <Checkbox label="Disabled and checked" disabled defaultChecked />
        </div>
      </section>

      <section>
        <h2>Radio</h2>
        <div className="styleguide-stack">
          <Radio name="demo-radio" value="one" label="First option" defaultChecked />
          <Radio name="demo-radio" value="two" label="Second option" />
          <Radio name="demo-radio" value="three" label="Disabled option" disabled />
        </div>
      </section>

      <section>
        <h2>Toggle</h2>
        <div className="styleguide-stack">
          <Toggle label="Off" />
          <Toggle label="On" defaultChecked />
          <Toggle label="Disabled" disabled />
        </div>
      </section>

      <section>
        <h2>Input slot</h2>
        <div className="styleguide-stack">
          <InputSlot label="Email" type="email" placeholder="you@example.com" />
          <InputSlot placeholder="No label, just a placeholder" />
          <InputSlot label="With a trailing icon" trailingIcon={arrowIcon} />
          <InputSlot label="Disabled" placeholder="Cannot type here" disabled />
        </div>
      </section>
    </>
  );
}
