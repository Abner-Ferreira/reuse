import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ICity, ICountry, IState } from 'country-state-city'
import Image from 'next/image'

interface SelectProps {
  listOfCountries?: Array<ICountry>
  listOfStatesAndCities?: Array<IState> | Array<ICity>
  name?: string
  placeholder: string
  value?: string             
  onChange?: (val: string) => void 
}

export function SelectField({
  listOfCountries,
  listOfStatesAndCities,
  name,
  placeholder,
  value,
  onChange,
}: SelectProps) {
  return (
    <Select value={value} onValueChange={onChange} >
      <SelectTrigger className='w-full '>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position='popper'>
        <SelectGroup>
          {name && <SelectLabel>{name}</SelectLabel>}

          {listOfCountries?.map(e => (
            <SelectItem key={e.isoCode} value={e.isoCode}>
              <div className='flex items-center gap-2'>
                <Image
                  src={`https://flagcdn.com/w40/${e.isoCode?.toLowerCase()}.png`}
                  alt={e.name}
                  width={20}
                  height={15}
                  className='rounded-sm'
                />
                <span>{e.name}</span>
              </div>
            </SelectItem>
          ))}

          {listOfStatesAndCities?.map(e => (
            <SelectItem key={e.name} value={(e as IState).isoCode ?? e.name} >
              {e.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}