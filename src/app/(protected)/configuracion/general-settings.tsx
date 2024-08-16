import { Separator } from '@/components/ui/separator';
import { FC } from 'react';
import ConfiguracionGeneralForm from './general-settings-form';

interface Props {}

const ConfiguracionGeneral: FC<Props> = (props): JSX.Element => {
    return (
        <div className="space-y-6 max-w-screen-md p-4">
          <div className='space-y-2'>
            <h3 className="text-lg font-medium">Configuración General</h3>
            <p className="text-sm text-muted-foreground">
              Aquí podrás configurar los ajustes generales de ráfaga financiera.
            </p>
          </div>
          <Separator />
          <ConfiguracionGeneralForm />
        </div>
      )
};

export default ConfiguracionGeneral;