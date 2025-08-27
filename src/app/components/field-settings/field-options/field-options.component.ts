import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptionItem } from '../../../models/field.model';
import { Button } from "primeng/button";
@Component({
  selector: 'app-field-options',
  imports: [CommonModule,
    FormsModule, Button],
  templateUrl: './field-options.component.html',
  styleUrl: './field-options.component.css'
})
export class FieldOptionsComponent {
title = input.required<string>();
  options = input.required<OptionItem[]>();
  optionsChange = output<OptionItem[]>();

  addOption() {
    const currentOptions = this.options();
    const newOptions = [...currentOptions];
    newOptions.push({
      label: `Option ${newOptions.length + 1}`,
      value: `option-${newOptions.length + 1}`,
    });
    this.optionsChange.emit(newOptions);
  }

  removeOption(index: number) {
    const currentOptions = this.options();
    const newOptions = [...currentOptions];
    newOptions.splice(index, 1);
    this.optionsChange.emit(newOptions);
  }

  updateOption(index: number, newLabel: string) {
    const currentOptions = this.options();
    const newOptions = [...currentOptions];
    newOptions[index] = {
      ...newOptions[index],
      label: newLabel,
    };
    this.optionsChange.emit(newOptions);
  }
}
