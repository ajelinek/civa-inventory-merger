export const offices: Offices = {
  "EC": { name: "Eastland Companion Animal Hospital" },
  "BH": { name: "Big Hollow Companion Animal Hospital" },
  "LS": { name: "Limestone Companion Animal Hospital" },
  "MC": { name: "Marshall County Veterinary Clinic" },
  "WV": { name: "Wenona Vet Care" },
  "VC": { name: "Vet Care Associates" },
  "CIVA": { name: "Central Illinois Veterinary Associates" },
}

export const itemTypes: ItemTypes = {
  "I": { name: "Inventory Item" },
  "S": { name: "Service Item" },
  "G": { name: "Group" },
  "D": { name: "Dispensing Item" },
  "U": { name: "Unknown" },
}

export const classifications: Classifications = {
  "100": {
    name: "Professional Service",
    subClassifications: {
      "100a": {
        name: "Exams"
      },
      "100b": {
        name: "Parasite Exam"
      },
      "100c": {
        name: "Treatment"
      },
      "100d": {
        name: "Euthanasia"
      },
      "100e": {
        name: "Emergency"
      },
      "100f": {
        name: "Rescue"
      }
    }
  },
  "101": {
    name: "Vaccines",
    subClassifications: {
      "101a": {
        name: "Vaccine Inventory"
      },
      "101b": {
        name: "Dog Vaccinations"
      },
      "101c": {
        name: "Cat Vaccinations"
      },
      "101d": {
        name: "Other Vaccinations"
      }
    }
  },
  "102": {
    name: "Laboratory",
    subClassifications: {
      "102a": {
        name: "Lab In House"
      },
      "102b": {
        name: "Lab - Outside"
      },
      "102c": {
        name: "Antech"
      }
    }
  },
  "103": {
    name: "Surgery",
    subClassifications: {
      "103a": {
        name: "Anesthesia"
      },
      "103b": {
        name: "Surgery"
      },
      "103c": {
        name: "Canine Spay"
      },
      "103d": {
        name: "Canine Neuter"
      },
      "103e": {
        name: "Feline Spay"
      },
      "103f": {
        name: "Feline Neuter"
      },
      "103g": {
        name: "Growth Removal"
      },
      "103h": {
        name: "Exploratory"
      },
      "103i": {
        name: "Orthopedic"
      },
      "103j": {
        name: "Dentistry"
      },
      "103k": {
        name: "Laceration Repair"
      },
      "103l": {
        name: "Rescue"
      }
    }
  },
  "104": {
    name: "Boarding",
    subClassifications: {
      "104a": {
        name: "Boarding Dog"
      },
      "104b": {
        name: "Boarding Cat"
      },
      "104c": {
        name: "Boarding Other"
      },
      "104d": {
        name: "Medical Boarding"
      }
    }
  },
  "105": {
    name: "Grooming",
    subClassifications: {
      "105a": {
        name: "Grooming Dog"
      },
      "105b": {
        name: "Grooming Cat"
      },
      "105c": {
        name: "Grooming Other"
      }
    }
  },
  "106": {
    name: "Pharmacy",
    subClassifications: {
      "106a": {
        name: "Tablets"
      },
      "106b": {
        name: "Liquids"
      },
      "106c": {
        name: "Injectables"
      },
      "106d": {
        name: "Controlled Substance"
      },
    }
  },
  "107": {
    name: "Parasiticide",
    subClassifications: {
      "107a": {
        name: "Injectable HW"
      },
      "107b": {
        name: "Oral HW"
      },
      "107c": {
        name: "HW/FC Combo"
      },
      "107d": {
        name: "Canine Oral Flea Control"
      },
      "107e": {
        name: "Canine Topical Flea Control"
      },
      "107f": {
        name: "Feline Oral Flea Control"
      },
      "107g": {
        name: "Feline Topical Flea Control"
      },
    }
  },
  "109": {
    name: "Message Props"
  },
  "110": {
    name: "Discounts"
  },
  "111": {
    name: "Miscellaneous",
    subClassifications: {
      "111a": {
        name: "Misc. Medical"
      },
      "111b": {
        name: "Postage"
      },
      "111c": {
        name: "Rabies Tags"
      }
    }
  },
  "112": {
    name: "Client Instruction Codes"
  },
  "113": {
    name: "Over the Counter"
  },
  "114": {
    name: "Prescription Diets",
    subClassifications: {
      "114a": {
        name: "Hills"
      },
      "114b": {
        name: "Purina"
      },
      "114c": {
        name: "Miscellaneous Food"
      }
    }
  },
  "115": {
    name: "Imaging",
    subClassifications: {
      "115a": {
        name: "Radiology"
      },
      "115b": {
        name: "Ultra Sound"
      }
    }
  },
  "116": {
    name: "Supplies",
    subClassifications: {
      "116a": {
        name: "Surgical Supplies"
      },
      "116b": {
        name: "Office Supplies"
      },
      "116c": {
        name: "Medical Supplies"
      },
      "116d": {
        name: "Kennel Supplies"
      },
      "116e": {
        name: "Janitorial Supplies"
      }
    }
  },
  "117": {
    name: "Large Animal",
    subClassifications: {
      "117a": {
        name: "LA Parasiticide"
      },
      "117b": {
        name: "LA Miscellaneous"
      },
      "117c": {
        name: "LA Supplies"
      },
      "117d": {
        name: "LA Pharmacy"
      },
      "117e": {
        name: "LA Laboratory"
      },
      "117f": {
        name: "LA Professional Services"
      },
      "117g": {
        name: "LA Radiology"
      },
      "117h": {
        name: "LA Vaccine"
      }
    }
  },
  "118": {
    name: "Hospitalization",
    subClassifications: {
      "118a": {
        name: "Hospitalization Dog"
      },
      "118b": {
        name: "Hospitalization Cat"
      },
      "118c": {
        name: "Hospitalization Other"
      },
      "118d": {
        name: "Isolation"
      },
    }
  },
  "119": {
    name: "Dispensing Codes",
  }
}