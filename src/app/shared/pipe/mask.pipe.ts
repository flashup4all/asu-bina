import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mask' })
export class MaskPipe implements PipeTransform {
    transform(phrase: string) {    
        let toBeReplaced = phrase.slice(0, 3);
        return phrase.replace(toBeReplaced, "xxx-xxx");
    }
}